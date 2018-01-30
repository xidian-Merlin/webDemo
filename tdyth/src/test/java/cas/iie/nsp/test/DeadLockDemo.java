package cas.iie.nsp.test;
import java.util.concurrent.*;

public class DeadLockDemo {
	public static void main(String[] args) {
	
		new DeadLockDemo().deadLock();
	}
	
	private String A="A";
	private String B="B";
	private void deadLock()
	{
		Thread thread1=new Thread(new Runnable() {
			@Override
			public void run() {
				synchronized(A)
				{
					try {
						Thread.currentThread().sleep(300);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					synchronized (B) {
						System.out.println("1");
					}
				}
			}
		});
		
		Thread thread2=new Thread(new Runnable() {
			@Override
			public void run() {
				synchronized (B) {
					try {
						Thread.currentThread().sleep(300);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					synchronized (A) {
						System.out.println("2");
					}
				}
			}
		});
		thread1.start();
		thread2.start();
	}
		
}