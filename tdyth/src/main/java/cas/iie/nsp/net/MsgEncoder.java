package cas.iie.nsp.net;

import java.util.HashMap;
import java.util.List;

import cas.iie.nsp.model.Configuration;
import cas.iie.nsp.model.ProtocolMsg;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

public class MsgEncoder extends MessageToByteEncoder<ProtocolMsg> {

	/**
	 * IP MAC等需要转换为字节数组
	 * @param srcString
	 * @return
	 */
	public byte[] StrSpiltToBytes(String srcString) {
		
		byte[] result = null;
		if (srcString.contains(".")) {
			String strs[] = srcString.split("\\.");
			result = new byte[strs.length];
			int i = 0;
			for (String string : strs) {
				result[i++] = (byte) Integer.parseInt(string);
			}
		} else if (srcString.contains(":")) {
			String[] strs = srcString.split(":");
			result = new byte[strs.length];
			int i = 0; 
			for (String string : strs) {
				result[i++] = (byte) Integer.decode("0x" + string).byteValue();
			}
		}
		return result;
	}

	/**
	 * 通过主命令码和子命令码来找到Configuration中的指定映射表
	 * @param command 主命令码
	 * @param subcommand 子命令码
	 * @return protocolIndex
	 */
	public int getProtocolIndex(int command,int subcommand){
		int protocolIndex=-1;
		if(command==0x0005){
			switch (subcommand) {
			case 0x00: protocolIndex=0;
				break;
			case 0x01: protocolIndex=1;
				break; 
			case 0x02: protocolIndex=3;
				break;
			case 0x03: protocolIndex=2;
				break;
			}
		}else if(command==0x0102){
			switch (subcommand) {
			case 0x00: protocolIndex=1;
				break;
			case 0x01: protocolIndex=2;
				break; 
			case 0x02: protocolIndex=3;
				break;
			case 0x03: protocolIndex=2;
				break;
			}
		}
		return protocolIndex;
	}
	
	/**
	 * 计算整个消息体的长度
	 * @param fixedBodyMsg 消息体固定部分
	 * @param paramsMapList 消息体可变部分
	 * @return length 消息长度
	 */
	public int getLength(HashMap<String, Object>fixedBodyMsg,List<HashMap<String, Object>> paramsMapList){
		int length=37;//消息头部数据(8字节)+消息主体固定部分(29字节)
		int command=Integer.parseInt((String) fixedBodyMsg.get("command").toString());
		int subcommand=Integer.parseInt((String) fixedBodyMsg.get("subcommand").toString());
		int protocolIndex=getProtocolIndex(command,subcommand);
		for (HashMap<String, Object> hashMap : paramsMapList) {
			Object clazz = Configuration.list.get(protocolIndex).get(hashMap.get("type")+"");
			if (clazz.equals(byte.class)) {
				length=length+3+1;
			} else if (clazz.equals(short.class)) {
				length=length+3+2;
			} else if (clazz.equals(int.class)) {
				length=length+3+4;
			}else if (clazz.equals(double.class)) {
				length=length+3+8;
			} else if (clazz.equals(byte[].class)) {
				length=length+3+StrSpiltToBytes((String)hashMap.get("value").toString()).length;
			} else if (clazz.equals(String.class)) {
				length=length+3+((String) hashMap.get("value").toString()).length()+1;
			}
		}
		return length;
	}
	 
	@Override
	protected void encode(ChannelHandlerContext ctx,  ProtocolMsg protocolMsg, ByteBuf out)
			throws Exception {
		//out.writeBytes("hi server i success...".getBytes("ASCII"));
		//out.writeInt(1);
		
		//分别获取消息头部数据，消息固定部分和消息可变部分
		HashMap<String, Object> headerMsgMap=protocolMsg.getHeaher();
		HashMap<String, Object>fixedBodyMsg=protocolMsg.getFixedBody();
		List<HashMap<String, Object>> paramsMapList=protocolMsg.getParamsMapList();
		/*****头部信息*******/
		//out.writeByte(0x01);//版本号
		out.writeByte((byte)Integer.parseInt((String) headerMsgMap.get("classfication").toString()));//消息类别
		//out.writeByte(0x11);//消息类别
		out.writeByte((byte)Integer.parseInt((String) headerMsgMap.get("type").toString()));//消息类型
		out.writeShort(0x0001);//消息类型
		//out.writeInt(0xEC);//消息头
		out.writeInt(getLength(fixedBodyMsg,paramsMapList));//小
		//*****固定部分信息******
		out.writeBytes(((String)fixedBodyMsg.get("configSenderID").toString()).getBytes("ASCII"));//发起策略请求的管理中心
		out.writeInt(Integer.parseInt((String)fixedBodyMsg.get("userID").toString()));//请求策略配置的管理员ID
		out.writeDouble(Double.parseDouble((String)fixedBodyMsg.get("time").toString()));//配置发送者唯一时间标识
		   
		int command=Integer.parseInt((String) fixedBodyMsg.get("command").toString());
		int subcommand=Integer.parseInt((String) fixedBodyMsg.get("subcommand").toString());
		out.writeShort((short)257);//主命令码
		out.writeByte((byte)0x01);//主命令码
		
		out.writeShort((short)Integer.parseInt((String)fixedBodyMsg.get("targetSize").toString()));//准备设置策略的目标设备
		String []targetIDArrays=((String)fixedBodyMsg.get("targetID").toString()).split(",");
		for (String string : targetIDArrays) {
			out.writeBytes(string.getBytes("ASCII"));//准备设置策略的目标设备
		}
		    
		  
		//*****可变部分信息******
		int protocolIndex=getProtocolIndex(command,subcommand);
		for (HashMap<String, Object> hashMap : paramsMapList) {
			Object clazz = Configuration.list.get(protocolIndex).get(hashMap.get("type").toString());
			if (clazz.equals(byte.class)) { 
				out.writeByte((byte)Integer.parseInt((String)hashMap.get("type").toString()));
				out.writeShort(1);
				out.writeByte((byte)Integer.parseInt((String)hashMap.get("value").toString()));
			} else if (clazz.equals(short.class)) {
				out.writeByte((byte)Integer.parseInt((String)hashMap.get("type").toString()));
				out.writeShort(2);
				out.writeShort((short)Integer.parseInt((String)hashMap.get("value").toString()));
			} else if (clazz.equals(int.class)) {
				out.writeByte((byte)Integer.parseInt((String)hashMap.get("type").toString()));
				out.writeShort(4);
				out.writeInt(Integer.parseInt((String) hashMap.get("value").toString()));
			}else if (clazz.equals(double.class)) {
				out.writeByte((byte)Integer.parseInt((String)hashMap.get("type").toString()));
				out.writeShort(8);
				out.writeDouble(Double.parseDouble((String) hashMap.get("value").toString()));
			} else if (clazz.equals(byte[].class)) {
				out.writeByte((byte)Integer.parseInt((String)hashMap.get("type").toString()));
				out.writeShort(StrSpiltToBytes((String)hashMap.get("value").toString()).length);
				out.writeBytes(StrSpiltToBytes((String)hashMap.get("value").toString()));
			} else if (clazz.equals(String.class)) {
				out.writeByte((byte)Integer.parseInt((String)hashMap.get("type").toString()));
				out.writeShort(((String) hashMap.get("value")).length() + 1);
				out.writeBytes((hashMap.get("value") + "\0").getBytes("ASCII"));
			}
		}
		out.writeByte(0);
		out.writeShort(0);
		out.writeBytes("\0".getBytes());
	}
}
