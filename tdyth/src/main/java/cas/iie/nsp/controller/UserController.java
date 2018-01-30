package cas.iie.nsp.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cas.iie.nsp.exception.UserException;
import cas.iie.nsp.model.User;
import cas.iie.nsp.service.IIndexService;
import cas.iie.nsp.service.IUserService;
import cas.iie.nsp.service.impl.IndexServiceImpl;
import cas.iie.nsp.service.impl.UserServiceImpl;

@Controller
@RequestMapping(value="/user")
public class UserController {
	 private static Logger logger = Logger.getLogger(UserController.class);  
  
   // @Autowired
   // private UserServiceImpl userService;
	 
	 @Autowired
	 private IIndexService indexService;
	 @Autowired 
	 private IUserService userService;
	 
    @RequestMapping(value="/login", method=RequestMethod.POST)
    public @ResponseBody Map<String,Object> login(HttpServletRequest request ){
    	String userName =request.getParameter("username");
    	String passWord =request.getParameter("password");
    	Map<String,Object> map=new HashMap<String,Object>();
    	logger.info("userName====>"+userName);
        if (null == userName || "".equals(userName.trim())) {
            throw new UserException("用户名不能为空");
        }
       // User user = userService.getUserByUsername(userName);
       //map= indexService.findUserByName(userName);
       //logger.info("map===========>"+map.toString());
       /*User user=new User();
       user.setUsername((String)map.get("userName"));
       user.setPassword((String)map.get("password"));
       if (null == user) {
           throw new UserException("用户名不存在");
       } 
       if (!user.getPassword().equals(passWord)) {
           throw new UserException("密码不正确");
       }*/
       if(userName.equals("admin")){  
           map.put("result", true);            
           map.put("message", "登陆成功！");            
       }else{  
       	 map.put("result", false);            
            map.put("message", "用户名或密码错误！");              
       }
       return map;
   }
    
    
    @RequestMapping(value="/button")
    public String button(HttpServletRequest request ){
    	logger.info("userName====>");
        
       return "user/button";
   }
   
}