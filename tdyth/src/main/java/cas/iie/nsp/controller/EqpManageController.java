package cas.iie.nsp.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import cas.iie.nsp.model.Eqp;
import cas.iie.nsp.service.IEqpManageService;
import cas.iie.nsp.utils.WDWUtils;

@Controller
@RequestMapping(value = "/eqpManage")
public class EqpManageController {
	@Autowired
	IEqpManageService eqpManageService;

	/**
	 * 设备类型管理页面跳转
	 * 
	 * @return
	 */
	@RequestMapping(value = "/eqpTypeInit")
	public String eqpTypeInit() {
		return "eqpManage/eqpType";
	}

	/**
	 * 获取设备class下拉列表
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/eqpClassList")
	public @ResponseBody Map<String, Object> getEqpClassList(HttpServletRequest request) {
		List<Map<String, Object>> resultList = eqpManageService.getEqpClassList();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result", true);
		resultMap.put("infoList", resultList);
		return resultMap;
	}

	/**
	 * 获取设备类型列表
	 * 
	 * @param request
	 * @param currentPage
	 *            当前页
	 * @param numPerPage
	 *            页面大小
	 * @return
	 */
	@RequestMapping(value = "/eqpTypeList")
	public @ResponseBody Map<String, Object> getEqpTypeList(HttpServletRequest request) {
		String currentPageStr = request.getParameter("currentPage");
		String numPerPageStr = request.getParameter("numPerPage");
		if (currentPageStr == null || numPerPageStr == null) {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("result", false);
			return resultMap;
		} else {
			int currentPage = Integer.parseInt(currentPageStr);
			int numPerPage = Integer.parseInt(numPerPageStr);
			Map<String, Object> resultMap = eqpManageService.getEqpTypeList(currentPage, numPerPage);
			return resultMap;
		}
	}

	/**
	 * 增加、修改和删除设备类型
	 * 
	 * @param request
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	@RequestMapping(value = "/eqpTypeModify")
	public @ResponseBody Map<String, Object> eqpTypeModify(HttpServletRequest request)
			throws IllegalStateException, IOException {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String imgStoredPath = request.getSession().getServletContext().getRealPath("/") + "resources/images/";
		int operateType = Integer.parseInt(request.getParameter("operateType"));
		String imgName = null;
		// 新增和编辑类型
		// eqpClassId:1(网络设备，即下拉选择所属大类)；eqpTypeName: 宽带卫星安全接入网关；文件
		if (operateType == 1 || operateType == 2) {
			// 将当前上下文初始化给 CommonsMutipartResolver （多部分解析器）
			CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
					request.getSession().getServletContext());
			// 检查form中是否有enctype="multipart/form-data"
			if (multipartResolver.isMultipart(request)) {
				// 将request变成多部分request
				MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
				// 获取multiRequest 中所有的文件名
				Iterator<String> iter = multiRequest.getFileNames();
				while (iter.hasNext()) {
					// 一次遍历所有文件
					MultipartFile file = multiRequest.getFile(iter.next().toString());
					if (file != null) {
						imgName = file.getOriginalFilename();
						String path = imgStoredPath + imgName;
						// 上传
						file.transferTo(new File(path));
					}
				}
			}
			int eqpClassId = Integer.parseInt(request.getParameter("eqpClassId"));
			String eqpTypeName = request.getParameter("eqpTypeName");
			String eqpTypeIdStr = request.getParameter("eqpTypeId");
			int eqpTypeId = -1;
			if (eqpTypeIdStr != null) {
				eqpTypeId = Integer.parseInt(eqpTypeIdStr);
			}
			boolean result = eqpManageService.eqpTypeModify(operateType, eqpClassId, eqpTypeId, eqpTypeName, imgName);
			resultMap.put("result", result);
			return resultMap;
		} else if (operateType == 3) {
			String eqpTypeIdList = request.getParameter("eqpTypeIdList");
			boolean result = eqpManageService.eqpTypeDelete(eqpTypeIdList);
			resultMap.put("result", result);
			return resultMap;
		} else {
			resultMap.put("result", false);
			return resultMap;
		}
	}

	/****************************************************************************/
	/**
	 * 设备安全域管理页面跳转
	 * 
	 * @return
	 */
	@RequestMapping(value = "/eqpSecDomInit")
	public String eqpSecDomInit() {
		return "eqpManage/eqpSecDom";
	}

	/**
	 * 获取设备安全域列表
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/eqpSecDomList")
	public @ResponseBody Map<String, Object> getEqpsecDomList(HttpServletRequest request) {
		String currentPageStr = request.getParameter("currentPage");
		String numPerPageStr = request.getParameter("numPerPage");
		if (currentPageStr == null || numPerPageStr == null) {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("result", false);
			return resultMap;
		} else {
			int currentPage = Integer.parseInt(currentPageStr);
			int numPerPage = Integer.parseInt(numPerPageStr);
			Map<String, Object> resultMap = eqpManageService.getSecDomList(currentPage, numPerPage);
			return resultMap;
		}
	}

	/**
	 * 安全域增加、修改和删除
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/eqpSecDomModify")
	public @ResponseBody Map<String, Object> eqpSecDomModify(HttpServletRequest request)
			throws IllegalStateException, IOException {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		int operateType = Integer.parseInt(request.getParameter("operateType"));
		// 新增和编辑类型
		if (operateType == 1 || operateType == 2) {
			String eqpSecDomIdStr = request.getParameter("eqpSecDomId");
			String eqpSecDomName = request.getParameter("eqpSecDomName");
			String eqpSecDomDesc = request.getParameter("eqpSecDomDesc");
			int eqpSecDomId = -1;
			if (eqpSecDomIdStr != null) {
				eqpSecDomId = Integer.parseInt(eqpSecDomIdStr);
			}
			boolean result = eqpManageService.eqpSecDomModify(operateType, eqpSecDomId, eqpSecDomName, eqpSecDomDesc);
			resultMap.put("result", result);
			return resultMap;
		} else if (operateType == 3) {
			String eqpSecDomIdList = request.getParameter("eqpSecDomIdList");
			boolean result = eqpManageService.eqpSecDomDelete(eqpSecDomIdList);
			resultMap.put("result", result);
			return resultMap;
		} else {
			resultMap.put("result", false);
			return resultMap;
		}
	}

	/****************************************************************************************************/
	/**
	 * 设备登记页面跳转
	 * 
	 * @return
	 */
	@RequestMapping(value = "/eqpRegInit")
	public String eqpRegInit() {
		return "eqpManage/eqpReg";
	}

	/**
	 * 获取设备安全域列表
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/eqpRegList")
	public @ResponseBody Map<String, Object> getEqpRegList(HttpServletRequest request) {
		String currentPageStr = request.getParameter("currentPage");
		String numPerPageStr = request.getParameter("numPerPage");
		if (currentPageStr == null || numPerPageStr == null) {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("result", false);
			return resultMap;
		} else {
			int currentPage = Integer.parseInt(currentPageStr);
			int numPerPage = Integer.parseInt(numPerPageStr);
			Map<String, Object> resultMap = eqpManageService.getEqpRegList(currentPage, numPerPage);
			return resultMap;
		}
	}

	/**
	 * 手动地设备登记
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/eqpRegManualAdd")
	public @ResponseBody Map<String, Object> eqpRegManualAdd(HttpServletRequest request) {
		String eqpNo = request.getParameter("eqpNo");
		String name = request.getParameter("name");
		String assetTypeStr = request.getParameter("assetType");
		String assetValueStr = request.getParameter("assetValue");
		String securityDomainStr = request.getParameter("securityDomain");
		String workModeStr = request.getParameter("workMode");
		String manageModeStr = request.getParameter("manageMode");
		String os = request.getParameter("os");
		String account = request.getParameter("account");
		String ip = request.getParameter("ip");
		String pass =request.getParameter("pass");
		String location = request.getParameter("location");
		String serial = request.getParameter("serial");
		String contaction = request.getParameter("contaction");
		if (eqpNo == null || name == null || assetTypeStr == null || assetValueStr == null || securityDomainStr == null
				|| os == null || ip == null) {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("result", false);
			return resultMap;
		} else {
			Integer assetType=null;
			if(assetTypeStr!=""||assetTypeStr!=null){
				assetType = Integer.parseInt(assetTypeStr);
			}
			//弹框进行设备信息登记
			
			Float assetValue = null;
			if(assetValueStr!=""||assetValueStr!=null){
				assetValue=Float.parseFloat(assetValueStr);
			}
			Integer securityDomain=null;
			if(securityDomainStr!=""||securityDomainStr!=null){
				securityDomain = Integer.parseInt(securityDomainStr);
			}
			
			Integer workMode=null;
			if(workModeStr!=""||workModeStr!=null){
				workMode = Integer.parseInt(workModeStr);
			}
			
			Integer manageMode=null;
			if(manageModeStr!=""||manageModeStr!=null){
				manageMode = Integer.parseInt(manageModeStr);
			}
			Eqp eqp = new Eqp(eqpNo, name, assetType, assetValue, securityDomain, workMode, manageMode, os, account,
					pass, ip, location, serial, contaction);
			Map<String, Object> resultMap = eqpManageService.addEqpRegManual(eqp);
			return resultMap;
		}
	}

	/**
	 * 下载Excel模板
	 * @param fileName
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/templateDownload")
	public void templateDownload(String fileName, HttpServletRequest request, HttpServletResponse response) {
		response.setCharacterEncoding("utf-8");
		response.setContentType("multipart/form-data");
		response.setHeader("Content-Disposition", "attachment;fileName=" + fileName);
		try {   
			//这个download目录建立在classes下的
			String path = Thread.currentThread().getContextClassLoader().getResource("").getPath();
			InputStream inputStream = new FileInputStream(new File(path + File.separator + fileName));
			OutputStream outputStream = response.getOutputStream();
			byte[] bytes = new byte[2048];
			int length;
			while ((length = inputStream.read(bytes)) > 0) {
				outputStream.write(bytes, 0, length);
			}
			outputStream.close();
			inputStream.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 上传Excel,读取Excel中内容
	 * @param file
	 * @param request
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/excelUpload")
	public @ResponseBody Map<String, Object> excelUpload(@RequestParam(value = "fileName") MultipartFile file,
			HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String msg = null;
		// 判断文件是否为空
		if (file == null) {
			msg = "文件是为空！";
			resultMap.put("result", false);
			resultMap.put("msg", msg);
			return resultMap;
		}
		// 获取文件名
		String name = file.getOriginalFilename();
		// 进一步判断文件是否为空（即判断其大小是否为0或其名称是否为null）验证文件名是否合格
		long size = file.getSize();
		if (name == null || ("").equals(name) || size == 0 || !WDWUtils.validateExcel(name)) {
			msg = "文件格式不正确！请使用.xls或.xlsx后缀文档。";
			resultMap.put("result", false);
			resultMap.put("msg", msg);
			return resultMap;
		}
		resultMap=eqpManageService.addEqpRegExcel(file);
		return resultMap;
	}
}
