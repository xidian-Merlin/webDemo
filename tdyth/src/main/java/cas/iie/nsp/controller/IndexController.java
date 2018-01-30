package cas.iie.nsp.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import cas.iie.nsp.service.ITopoService;
import cas.iie.nsp.service.IUserService;

@Controller
@RequestMapping(value="/index")
public class IndexController {
	@Autowired ITopoService topoService;
	
	 private static Logger logger = Logger.getLogger(IndexController.class);  
  
    @RequestMapping(value="/list", method=RequestMethod.POST)
    public @ResponseBody Map<String,Object> login(HttpServletRequest request ){
    	String date =request.getParameter("date");
    	String pageIndex =request.getParameter("pageIndex");
    	Map<String,Object> map=new HashMap<String,Object>();
    	map.put("result", pageIndex);
        return map;
    }
    
    @RequestMapping(value="/main")
    public String main(Model model){
    	return "main/main";
    } 
    
    @RequestMapping(value="/init")
    public String index(Model model){
    	return "dataStatistical/dataAnalysis";
    } 
}