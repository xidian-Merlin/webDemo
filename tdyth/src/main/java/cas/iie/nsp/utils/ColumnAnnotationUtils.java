package cas.iie.nsp.utils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public class ColumnAnnotationUtils {
	
	@Target(java.lang.annotation.ElementType.FIELD)  
	@Retention(RetentionPolicy.RUNTIME)  
	public @interface Column {  
	  
	    String name() default "";  
	  
	}  

}
