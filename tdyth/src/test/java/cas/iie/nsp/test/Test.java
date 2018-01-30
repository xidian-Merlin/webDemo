package cas.iie.nsp.test;

public class Test {
	public static void main(String[] args) {
		
		System.gc();
		Integer.parseInt(null);
		for(int i=0;i<10;i++)
		{
			for(int j=1;j<=20;j++)
			{
				if(j==8)
					break;
				System.out.println(j);
			}
		}
	}	
}