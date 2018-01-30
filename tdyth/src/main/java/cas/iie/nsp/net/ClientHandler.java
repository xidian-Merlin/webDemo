package cas.iie.nsp.net;

import cas.iie.nsp.model.Configuration;
import cas.iie.nsp.model.ProtocolMsg;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

public class ClientHandler extends SimpleChannelInboundHandler<ProtocolMsg> {
	private ProtocolMsg protocolMsg;

	public ClientHandler(ProtocolMsg protocolMsg) {
		this.protocolMsg = protocolMsg;
	}

	// 客户端连接服务器后被调用
	@Override
	public void channelActive(ChannelHandlerContext ctx) throws Exception {
		// 发送协议消息
		ctx.writeAndFlush(protocolMsg);
	}

	@Override
	protected void channelRead0(ChannelHandlerContext ctx, ProtocolMsg msg) throws Exception {
		// 用于获取客户端发来的数据信息
		ProtocolMsg body = msg;
		System.out.println("Client接受的服务器端的信息 :" + body.toString() + "\t count=====>");
		//ctx.close();
	}

	// 发生异常时被调用
	@Override
	public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
		System.out.println("client exceptionCaught..");
		// 释放资源 
		ctx.close();  
	}
}