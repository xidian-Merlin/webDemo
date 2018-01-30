package cas.iie.nsp.controller;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cas.iie.nsp.service.ITopoService;
import net.sf.json.JSONSerializer;

@Controller 
@RequestMapping(value="/topo")
public class TopoController {
	private static Logger logger = Logger.getLogger(IndexController.class);  
	@Autowired ITopoService topoService;
	
    @RequestMapping(value="/topo_1")
    public String topo_1(Model model,HttpServletRequest request){  
    	
    	//获取当前的缩放层级
    	int zoomLevel = 1;
    	if(request.getParameter("zoomLevel")!=null)
    		zoomLevel=Integer.parseInt(request.getParameter("zoomLevel"));
    	//TODO 异常处理 zoomLevel的值
    	//获取当前层级的拓扑数据    	
    	Map<String,Object>map=getToPoData(zoomLevel);   
    	//将Map转换为Json
    	model.addAttribute("result",JSONSerializer.toJSON(map));
    	logger.info(JSONSerializer.toJSON(map));
    	return "topoManage/topo_1";    
    } 
   
    @RequestMapping(value="/topo_2")
    public String topo_2(Model model,HttpServletRequest request){
    	logger.info("parameter============>"+request.getParameter("name"));
    	//获取当前的缩放层级
    	int zoomLevel = 2;
    	if(request.getParameter("zoomLevel")!=null)
    		zoomLevel=Integer.parseInt(request.getParameter("zoomLevel"));
    	//TODO 异常处理 zoomLevel的值
    	//获取当前层级的拓扑数据
    	Map<String,Object>map=getToPoData(zoomLevel);
    	//将Map转换为Json
    	model.addAttribute("result",JSONSerializer.toJSON(map));
    	return "topoManage/topo_2";
    }  
    
    @RequestMapping(value="/topo_3")
    public String topo_3(Model model,HttpServletRequest request){
    	//获取当前的缩放层级
    	int zoomLevel = 3;
    	if(request.getParameter("zoomLevel")!=null)
    		zoomLevel=Integer.parseInt(request.getParameter("zoomLevel"));
    	//获取当前层级的拓扑数据
    	//TODO 异常处理 zoomLevel的值
    	Map<String,Object>map=getToPoData(zoomLevel);
    	//将Map转换为Json
    	model.addAttribute("result",JSONSerializer.toJSON(map));
    	return "topoManage/topo_3";
    }  
    
    //获取当前层级的拓扑数据
    Map<String,Object> getToPoData(int zoomLevel){
    	//测试当前函数的运行时间
    	SimpleDateFormat format=new SimpleDateFormat("YYYY-MM-dd HH:yy:ss:SSS");
    	logger.info(format.format(new Date()));
    	List<Map<String, Object>> listMap= topoService.findTopoNodesAll("TOPOLONODE1");
    	logger.info(listMap);
    	Map<String,Object> newMap=new HashMap<String,Object>();
    	List<Map<String, Object>> listNodes=new ArrayList<Map<String, Object>>();
    	List<Map<String, Object>> listEdges=new ArrayList<Map<String, Object>>();
    	//获取当前放缩层级的所有节点
    	for (Map<String, Object> map : listMap) {
    		//筛选出满足本层级的所有拓扑节点
    		if((Integer)map.get("zoomLevelID")==zoomLevel)
			{
    			//新建拓扑节点集，并添加到list中
				Map<String,Object> nodeMap=new HashMap<String,Object>();
				nodeMap.put("nodeID", map.get("nodeID"));
				nodeMap.put("nodeName", ((String)map.get("nodeName")).trim());
				nodeMap.put("nodeRemark", ((String)map.get("nodeRemark")).trim());
				nodeMap.put("areaID", map.get("areaID"));
				nodeMap.put("zoomLevelID", map.get("zoomLevelID"));
				nodeMap.put("upperLevelAreaID", map.get("upperLevelAreaID"));
				nodeMap.put("eqpNo", map.get("eqpNo"));
				nodeMap.put("locationX", map.get("locationX"));
				nodeMap.put("locationY", map.get("locationY"));
				listNodes.add(nodeMap);
			}
    		//边集的获取直接思路就是当取出当前缩放层的所有记录后，遍历时获取每条记录中的下联节，并组装成前端所需格式
    		if((Integer)map.get("zoomLevelID")==zoomLevel&&((Integer)map.get("recordNum")!=0||map.get("recordNum")!=null))
			{
    			int sourceNode=(Integer)map.get("nodeID");
    			//寻找每条记录中的所有下联节点(target节点)，node 1-20
    			for(int i=1;i<=20;i++)
    			{
    				Map<String,Object> edgeMap=new HashMap<String,Object>();
    				//如果当前记录中的当前下联节点为空，必然记录中以后的所有下联节点都为空，所以可以直接跳过当前循环
    				if(map.get("node"+i+"_ID")==null)
    						break; 
    				int targerNode=(int)map.get("node"+i+"_ID");
    				String edgeAttr=(String) map.get("node"+i+"_Attr");
    				edgeMap.put("source", sourceNode);
    				edgeMap.put("target", targerNode);
    				edgeMap.put("attr", edgeAttr.trim());
    				listEdges.add(edgeMap);
    			}
			}
		}
    	//添加点集
    	newMap.put("listNodes", listNodes);	
    	//添加边集
    	newMap.put("listEdges", listEdges);	
    	logger.info(format.format(new Date()));
    	//logger.info(JSONSerializer.toJSON(newMap));
    	return newMap;
    }    
 
    
/************************************第二版本的拓扑图接口*******************************************/   
    
    /**
     * 返回topo_v2视图
     * @return
     */
    @RequestMapping(value="/topoV2")
    public String topoV2(){
    	return "topoManage/topo_v2";
    }  
    
    /**
     * 返回topo_preview的数据
     * @param model
     * @param request
     * @return
     */
    @RequestMapping(value="/topo_preview")
    public @ResponseBody Map<String,Object> getToPoPreviewData(Model model,HttpServletRequest request){
    	logger.info("parameter============>"+request.getParameter("zoomLevel"));
    	//获取当前的缩放层级
    	int zoomLevel = 0;
    	if(request.getParameter("zoomLevel")!=null)
    		zoomLevel=Integer.parseInt(request.getParameter("zoomLevel"));
    	//TODO 异常处理 zoomLevel的值
    	//获取当前层级的拓扑数据
    	List<Map<String, Object>> listMap= topoService.findDataByZoomLevel(zoomLevel);
    	Map<String,Object>map=getToPoDataV2(listMap);  
    	return map;
    }  
    
    /**
     * 返回topo_detail的数据
     * @return
     */
    @RequestMapping(value="/topo_detail")
    public @ResponseBody Map<String,Object> getToPoDetailData(Model model,HttpServletRequest request){
    	logger.info("parameter============>"+request.getParameter("zoomLevel"));
    	//获取当前的缩放层级
    	int zoomLevel = 1;
    	if(request.getParameter("zoomLevel")!=null)
    		zoomLevel=Integer.parseInt(request.getParameter("zoomLevel"));
    	//TODO 异常处理 zoomLevel的值
    	//获取当前层级的拓扑数据
    	List<Map<String, Object>> listMap= topoService.findDataByZoomLevel(zoomLevel);
    	Map<String,Object>map=getToPoDataV2(listMap);  
    	return map;
    }  
    
    /**
     * 获取第二层(部分收缩过后的)的拓扑图信息
     */
    @RequestMapping(value="/topo_detail_2")
    public @ResponseBody Map<String,Object> getToPoDetail2Data(Model model,HttpServletRequest request){
    	logger.info("zoomLevel============>"+request.getParameter("zoomLevel"));
    	logger.info("areaID============>"+request.getParameter("areaID"));
    	//获取当前的缩放层级
    	int zoomLevel = 2;
    	int upperLevelAreaID=8;
    	if(request.getParameter("zoomLevel")!=null)
    		zoomLevel=Integer.parseInt(request.getParameter("zoomLevel"));
    	if(request.getParameter("areaID")!=null)
    		upperLevelAreaID=Integer.parseInt(request.getParameter("upperLevelAreaID"));
    	//TODO 异常处理 zoomLevel的值
    	//获取当前层级的拓扑数据
    	List<Map<String, Object>> listMap=topoService.findDataByZoomLevel(zoomLevel);  
    	Map<String,Object>map=getToPoDataLevel2(listMap);  
    	return map;
    }  
    
    @RequestMapping(value="/topo_detail_3")
    public @ResponseBody Map<String,Object> getToPoDetail3Data(Model model,HttpServletRequest request){
    	logger.info("zoomLevel3============>"+request.getParameter("zoomLevel"));
    	//获取第3缩放层级的数据
    	int zoomLevel3 = 3;
    	int upperLevelAreaID=8;
    	if(request.getParameter("zoomLevel")!=null)
    		zoomLevel3=Integer.parseInt(request.getParameter("zoomLevel"));
    	if(request.getParameter("areaID")!=null)
    		upperLevelAreaID=Integer.parseInt(request.getParameter("upperLevelAreaID"));
    	//TODO 异常处理 zoomLevel的值
    	//获取当前层级的拓扑数据
    	List<Map<String, Object>> listMap=topoService.findDataByZoomLevel3(zoomLevel3);  
    	Map<String,Object>map=getToPoDataV2(listMap);  
    	return map;
    }  
    
    /**
     * 获取数据集和边集 v2版本
     */
    public  Map<String,Object>getToPoDataV2(List<Map<String, Object>> listMap)
    {
    	Map<String,Object> newMap=new HashMap<String,Object>();
    	List<Map<String, Object>> listNodes=new ArrayList<Map<String, Object>>();
    	List<Map<String, Object>> listEdges=new ArrayList<Map<String, Object>>();
    	for (Map<String, Object> map : listMap) {
    		//新建拓扑节点集，并添加到list中
			Map<String,Object> nodeMap=new HashMap<String,Object>();
			nodeMap.put("nodeID", map.get("nodeID"));
			nodeMap.put("eqpNo", map.get("eqpNo"));
			nodeMap.put("zoomLevelID", map.get("zoomLevelID"));
			nodeMap.put("areaID", map.get("areaID"));
			nodeMap.put("NodePicName", ((String)map.get("NodePicName")).trim());
			nodeMap.put("nodeName", ((String)map.get("nodeName")).trim());
			nodeMap.put("locationX", map.get("locationX"));
			nodeMap.put("locationY", map.get("locationY"));
			//该节点下面还有多少层级
			int nextLevelNum=(int)map.get("zoomLevelMax")-(int)map.get("zoomLevelID");
			if(nextLevelNum<=0)
				nextLevelNum=0;
			nodeMap.put("nextLevelNum", nextLevelNum);
			listNodes.add(nodeMap);
			
			if((Integer)map.get("recordNum")!=0||map.get("recordNum")!=null)
			{
				int sourceNode=(Integer)map.get("nodeID");
    			//寻找每条记录中的所有下联节点(target节点)，node 1-20
    			for(int i=1;i<=20;i++)
    			{
    				Map<String,Object> edgeMap=new HashMap<String,Object>();
    				//如果当前记录中的当前下联节点为空，必然记录中以后的所有下联节点都为空，所以可以直接跳过当前循环
    				if(map.get("node"+i+"_ID")==null)
    						break; 
    				int targerNode=(int)map.get("node"+i+"_ID");
    				String edgeAttr=(String) map.get("node"+i+"_Attr");
    				edgeMap.put("source", sourceNode);
    				edgeMap.put("target", targerNode);
    				edgeMap.put("attr", edgeAttr.trim());
    				listEdges.add(edgeMap);	
    			}
			}  
    	}
    	//添加点集
    	newMap.put("listNodes", listNodes);	
    	//添加边集
    	newMap.put("listEdges", listEdges);	
    	if(listNodes.size()==0||listEdges.size()==0)
    		newMap.put("result", false);	
    	else
    		newMap.put("result", true);	
    	logger.info(JSONSerializer.toJSON(newMap));
		return newMap;
    }
    
    /**
     * 针对第二层级的节点进行收缩处理
     * @param listMap
     * @return 第二层级部分节点收缩后的数据
     */
    public Map<String, Object> getToPoDataLevel2(List<Map<String, Object>> listMap) {
    	Map<String,Object> newMap=new HashMap<String,Object>();
    	List<Map<String, Object>> listNodes=new ArrayList<Map<String, Object>>();
    	List<Map<String, Object>> listEdges=new ArrayList<Map<String, Object>>();
    	for (Map<String, Object> map : listMap) {
    		//当前节点的ID
    		int sourceNode=(int)map.get("nodeID");
    		//当前节点的下面还有多少层级
    		int nextLevelNum; 
    		//获取当前节点的cascadeZoomWeight
    		BigDecimal bigDecimal=(BigDecimal) map.get("cascadeZoomWeight");
    		double cascadeZoomWeight=bigDecimal.doubleValue();
    		//获取级联缩放权重为1的节点，并且它的下联节点数不为0或null
			if(cascadeZoomWeight==1.0)
			{
				//新建拓扑节点集，并将当前节点添加到list中
				Map<String,Object> cascadeZoomNodeMap=new HashMap<String,Object>();
				cascadeZoomNodeMap.put("nodeID", map.get("nodeID"));
				cascadeZoomNodeMap.put("eqpNo", map.get("eqpNo"));
				cascadeZoomNodeMap.put("zoomLevelID", map.get("zoomLevelID"));
				cascadeZoomNodeMap.put("areaID", map.get("areaID"));
				cascadeZoomNodeMap.put("NodePicName", ((String)map.get("NodePicName")).trim());
				cascadeZoomNodeMap.put("nodeName", ((String)map.get("nodeName")).trim());
				cascadeZoomNodeMap.put("locationX", map.get("locationX"));
				cascadeZoomNodeMap.put("locationY", map.get("locationY"));
				cascadeZoomNodeMap.put("zoomLevelMin", map.get("zoomLevelMin"));
				//该节点下面还有多少层级
				nextLevelNum=(int)map.get("zoomLevelMax")-(int)map.get("zoomLevelID");
				if(nextLevelNum<=0)
					nextLevelNum=0;
				cascadeZoomNodeMap.put("nextLevelNum", nextLevelNum);
				listNodes.add(cascadeZoomNodeMap);
				
				int zoomedNodeNum=(int)map.get("ZoomedNodeNum");
				for(int i=1;i<=zoomedNodeNum;i++)
				{
					//遍历listMap获取当前节点的下联收缩节点
					for (Map<String, Object> mapFilter : listMap) 
					{
						//如果的当前节点的下联节点ID等于listMap中的某一节点ID,则可知该mapFilter即为收缩后的合并节点
						if((int)map.get("node"+i+"_ID")==(int)mapFilter.get("nodeID"))
						{
							//新建拓扑节点集,并添加到list中
							Map<String,Object> nodeMap=new HashMap<String,Object>();
							nodeMap.put("nodeID", mapFilter.get("nodeID"));
							nodeMap.put("eqpNo", mapFilter.get("eqpNo"));
							nodeMap.put("zoomLevelID", mapFilter.get("zoomLevelID"));
							nodeMap.put("areaID", mapFilter.get("areaID"));
							nodeMap.put("locationX", mapFilter.get("locationX"));
							nodeMap.put("locationY", mapFilter.get("locationY"));
							nodeMap.put("zoomLevelMin", map.get("zoomLevelMin"));
							nodeMap.put("NodePicName", ((String)mapFilter.get("ZoomedNodePicName")).trim());
							nodeMap.put("nodeName", ((String)mapFilter.get("zoomedNodeName")).trim());//zoomedNodeName
							//该节点下面还有多少层级
							nextLevelNum=(int)map.get("zoomLevelMax")-(int)map.get("zoomLevelID");
							if(nextLevelNum<=0)
								nextLevelNum=0;
							nodeMap.put("nextLevelNum", nextLevelNum);
							listNodes.add(nodeMap);
						}					
					}					
					//新建拓扑边集，并添加到list中
					Map<String,Object> edgeMap=new HashMap<String,Object>();
					int targerNode=(int)map.get("node"+i+"_ID");
					String edgeAttr=(String) map.get("node"+i+"_Attr");
					edgeMap.put("source", sourceNode);
					edgeMap.put("target", targerNode);
					edgeMap.put("attr", edgeAttr.trim());
					listEdges.add(edgeMap);
				}
			}else if(cascadeZoomWeight==0.0)
			{
				//当前节点是否在listNodes里面的标志位
				boolean falg=false;
				for (Map<String, Object> mapFlag : listNodes) 
				{
					//当前listNodes里面是否已经存在群相关节点
					if((int)mapFlag.get("nodeID")==(int)map.get("nodeID"))
					{
						falg=true;
						break;
					}
				}
				//如果已经存在nodeID相同的节点，则直接continue跳过，进入下一个循环，否则继续添加新的节点
				if(falg)
					continue;
				else{
					//新建拓扑节点集，并添加到list中
					Map<String,Object> nodeMap=new HashMap<String,Object>();
					nodeMap.put("nodeID", map.get("nodeID"));
					nodeMap.put("eqpNo", map.get("eqpNo"));
					nodeMap.put("zoomLevelID", map.get("zoomLevelID"));
					nodeMap.put("areaID", map.get("areaID"));
					nodeMap.put("NodePicName", ((String)map.get("NodePicName")).trim());
					nodeMap.put("nodeName", ((String)map.get("nodeName")).trim());
					nodeMap.put("locationX", map.get("locationX"));
					nodeMap.put("locationY", map.get("locationY"));
					nodeMap.put("zoomLevelMin", map.get("zoomLevelMin"));
					//该节点下面还有多少层级
					nextLevelNum=(int)map.get("zoomLevelMax")-(int)map.get("zoomLevelID");
					if(nextLevelNum<=0)
						nextLevelNum=0;
					nodeMap.put("nextLevelNum", nextLevelNum);
					listNodes.add(nodeMap);
					
					//新建拓扑边集，并添加到list中				
	    			//寻找每条记录中的所有下联节点(target节点)，node 1-20
	    			for(int i=1;i<=20;i++)
	    			{
	    				Map<String,Object> edgeMap=new HashMap<String,Object>();
	    				//如果当前记录中的当前下联节点为空，必然记录中以后的所有下联节点都为空，所以可以直接跳过当前循环
	    				if(map.get("node"+i+"_ID")==null)
	    						break; 
	    				int targerNode=(int)map.get("node"+i+"_ID");
	    				String edgeAttr=(String) map.get("node"+i+"_Attr");
	    				edgeMap.put("source", sourceNode);
	    				edgeMap.put("target", targerNode);
	    				edgeMap.put("attr", edgeAttr.trim());
	    				listEdges.add(edgeMap);	
	    			}
				}
				
			}	
    	}
    	//添加点集
    	newMap.put("listNodes", listNodes);	
    	//添加边集
    	newMap.put("listEdges", listEdges);	
    	if(listNodes.size()==0||listEdges.size()==0)
    		newMap.put("result", false);	
    	else
    		newMap.put("result", true);	
    	logger.info(JSONSerializer.toJSON(newMap));
    	return newMap;
    }
}
