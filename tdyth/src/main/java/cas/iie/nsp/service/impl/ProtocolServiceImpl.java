package cas.iie.nsp.service.impl;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import cas.iie.nsp.model.ProtocolMsg;
import cas.iie.nsp.net.ClientHandler;
import cas.iie.nsp.net.MsgDecoder;
import cas.iie.nsp.net.MsgEncoder;
import cas.iie.nsp.service.IProtocolService;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

@Service("ProtocolServiceImpl")
public class ProtocolServiceImpl implements IProtocolService {

	private static final String host = "192.168.90.88";
	private static final int port =4323;
   
	public void start(String host, int port, ProtocolMsg protocolMsg) throws Exception {
		// EventLoopGroup可以理解为是一个线程池，这个线程池用来处理连接、接受数据、发送数据
		EventLoopGroup nioEventLoopGroup = new NioEventLoopGroup();
		Bootstrap bootstrap = new Bootstrap(); // 客户端引导类
		bootstrap.group(nioEventLoopGroup);// 多线程处理
		try { 
			bootstrap.channel(NioSocketChannel.class);// 指定通道类型为NioServerSocketChannel，一种异步模式，OIO阻塞模式为OioServerSocketChannel
			bootstrap.remoteAddress(new InetSocketAddress(host, port));// 指定请求地址
			bootstrap.handler(new ChildChannelHandler(protocolMsg));// 业务处理类
			ChannelFuture channelFuture = bootstrap.connect().sync();// 链接服务器.调用sync()方法会同步阻塞
			channelFuture.channel().closeFuture().sync();// 最后绑定客户端等待直到绑定完成，调用sync()方法会阻塞直到客服端完成绑定,然后客户端等待通道关闭，因为使用sync()，所以关闭操作也会被阻塞。
		} finally {
			// 退出，释放线程池资源
			nioEventLoopGroup.shutdownGracefully().sync();
		}
	} 
    
	private class ChildChannelHandler extends ChannelInitializer<SocketChannel> {
		private ProtocolMsg protocolMsg;

		public ChildChannelHandler(ProtocolMsg protocolMsg) {
			this.protocolMsg = protocolMsg;
		}

		@Override
		protected void initChannel(SocketChannel ch) throws Exception {
			// 注册一个handler，处理之前正序执行handlerAdded方法，处理之后逆序执行handlerRemoved方法，如果出现异常执行exceptionCaught方法
			ch.pipeline().addLast(new MsgEncoder()).addLast(new MsgDecoder()).addLast(new ClientHandler(protocolMsg));
		}
	}

	@Override
	public Map<String, Object> sendMsg(HashMap<String, Object> heaher, HashMap<String, Object> fixedBody,
			List<HashMap<String, Object>> paramsMapList) throws Exception {
		ProtocolMsg protocolMsg = new ProtocolMsg(heaher, fixedBody, paramsMapList);
		start(host, port, protocolMsg);
		return null;
	}
}
