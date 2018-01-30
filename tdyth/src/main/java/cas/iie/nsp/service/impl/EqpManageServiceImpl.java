package cas.iie.nsp.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import cas.iie.nsp.dao.IEqpManageDao;
import cas.iie.nsp.model.Eqp;
import cas.iie.nsp.page.Pagination;
import cas.iie.nsp.service.IEqpManageService;
import cas.iie.nsp.utils.ReadExcelUtils;

@Service("EqpManageServiceImpl")
public class EqpManageServiceImpl extends BaseServiceImpl<Object> implements IEqpManageService {
	@Autowired
	IEqpManageDao eqpManageDao;

	@Override
	public Map<String, Object> getEqpTypeList(int currentPage, int numPerPage) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String sql = "select t1.\"id\",t1.\"name\" as \"typeName\",t1.\"pic\",t2.\"name\" as \"className\" from MNGT_SYS.EQPTYPE t1 left join MNGT_SYS.EQPCLASS t2 on t1.\"cfg\" = t2.\"id\"";
		Pagination page = eqpManageDao.queryPage(currentPage, numPerPage, sql);
		int totalRows = page.getTotalRows();
		List<Map<String, Object>> resultList = page.getResultList();
		resultMap.put("result", true);
		resultMap.put("totalRows", totalRows);
		resultMap.put("infoList", resultList);
		return resultMap;
	}

	@Override
	public boolean eqpTypeModify(int operateType, int eqpClassId, int eqpTypeId, String eqpTypeName,
			String eqpTypePicName) {
		System.out.println("operateType=========="+operateType);
		System.out.println("eqpClassId========="+eqpClassId);
		System.out.println("eqpTypeId========="+eqpTypeId);
		System.out.println("eqpTypeName======="+eqpTypeName);
		int affectRows = 0;
		if (operateType == 1) {
			affectRows = insert("insert into \"MNGT_SYS\".\"EQPTYPE\"(\"cfg\", \"name\", \"pic\") values(?,?,?)",
					new Object[] { eqpClassId, eqpTypeName, eqpTypePicName });
		} else if (operateType == 2) {
			affectRows = update(
					"update \"MNGT_SYS\".\"EQPTYPE\" t set t.\"cfg\" = ?,t.\"name\"=?,t.\"pic\"=? where t.\"id\" = ?;",
					new Object[] { eqpClassId, eqpTypeName, eqpTypePicName, eqpTypeId });
		}
		if (affectRows > 0) {
			return true;
		}
		return false;
	}

	@Override
	public boolean eqpTypeDelete(String eqpTypeIds) {
		String sql = "delete from \"MNGT_SYS\".\"EQPTYPE\" where \"id\"= ? ";
		int affectRows = 0;
		List<Object> paramsList = new ArrayList<Object>();
		String[] resultStr = eqpTypeIds.split(",");
		for (String string : resultStr) {
			paramsList.add(Integer.parseInt(string));
		}
		affectRows = eqpManageDao.batchDelete(sql, paramsList);
		if (affectRows > 0) {
			return true;
		}
		return false;
	}

	@Override
	public List<Map<String, Object>> getEqpClassList() {
		String sql = "select * from MNGT_SYS.EQPCLASS";
		List<Map<String, Object>> resultList = eqpManageDao.findList(sql, null);
		return resultList;
	}

	@Override
	public Map<String, Object> getSecDomList(int currentPage, int numPerPage) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String sql = "select t1.\"id\" as \"secDomId\",t1.\"name\" as \"secDomName\",t1.\"description\" from MNGT_SYS.SECDOMAINTBL t1 where 1=1 ";
		Pagination page = eqpManageDao.queryPage(currentPage, numPerPage, sql);
		int totalRows = page.getTotalRows();
		List<Map<String, Object>> resultList = page.getResultList();
		resultMap.put("result", true);
		resultMap.put("totalRows", totalRows);
		resultMap.put("infoList", resultList);
		return resultMap;
	}

	@Override
	public boolean eqpSecDomModify(int operateType, int eqpSecDomId, String eqpSecDomName, String eqpSecDomDesc) {
		int affectRows = 0;
		if (operateType == 1) {
			affectRows = insert("insert into \"MNGT_SYS\".\"SECDOMAINTBL\"(\"name\", \"description\") values(?,?)",
					new Object[] { eqpSecDomName, eqpSecDomDesc });
		} else if (operateType == 2) {
			affectRows = update(
					"update \"MNGT_SYS\".\"SECDOMAINTBL\" t set t.\"name\" = ?,t.\"description\"=? where t.\"id\" = ?;",
					new Object[] { eqpSecDomName, eqpSecDomDesc, eqpSecDomId });
		}
		if (affectRows > 0) {
			return true;
		}
		return false;
	}

	@Override
	public boolean eqpSecDomDelete(String eqpSecDomIds) {
		String sql = "delete from \"MNGT_SYS\".\"SECDOMAINTBL\" where \"id\"= ? ";
		int affectRows = 0;
		List<Object> paramsList = new ArrayList<Object>();
		String[] resultStr = eqpSecDomIds.split(",");
		for (String string : resultStr) {
			paramsList.add(Integer.parseInt(string));
		}
		affectRows = eqpManageDao.batchDelete(sql, paramsList);
		if (affectRows > 0) {
			return true;
		}
		return false;
	}

	@Override
	public Map<String, Object> getEqpRegList(int currentPage, int numPerPage) {
		List<Map<String, Object>> result = null;
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String sql = null;
		int totalRows;
		Pagination page = null;
		sql = "select t1.\"eqpNo\",t1.\"name\",t2.\"name\" as \"assetType\",t1.\"assetValue\",t3.\"name\" as \"securityDomain\",t1.\"workMode\",t1.\"manageMode\",t1.\"os\",t1.\"account\",t1.\"pass\",t1.\"ip\",t1.\"location\",t1.\"serial\",t1.\"contaction\" from MNGT_SYS.EQPREGTBL t1 left join MNGT_SYS.\"EQPTYPE\" t2 on t1.\"assetType\" =t2.\"id\" left join MNGT_SYS.\"SECDOMAINTBL\" t3 on t1.\"securityDomain\" =t3.\"id\"";
		Integer id = null;
		page = eqpManageDao.queryPage(currentPage, numPerPage, sql, id);
		totalRows = page.getTotalRows();
		result = page.getResultList();
		resultMap.put("result", true);
		resultMap.put("totalRows", totalRows);
		resultMap.put("infoList", result);
		return resultMap;
	}

	@Override
	public Map<String, Object> addEqpRegManual(Eqp eqp) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		String sql = "insert into \"MNGT_SYS\".\"EQPREGTBL\"(\"eqpNo\",\"name\", \"assetType\", \"assetValue\", \"securityDomain\", \"workMode\", \"manageMode\", \"os\", \"account\", \"pass\", \"ip\", \"location\", \"serial\", \"contaction\") VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		int affectRows=eqpManageDao.insertUpdate(sql,
				new Object[] { eqp.getEqpNo(), eqp.getName(), eqp.getAssetType(), eqp.getAssetValue(),
						eqp.getSecurityDomain(), eqp.getWorkMode(), eqp.getManageMode(), eqp.getOs(), eqp.getAccount(),
						eqp.getPass(), eqp.getIp(), eqp.getLocation(), eqp.getSerial(), eqp.getContaction() });
		if(affectRows>0){
			resultMap.put("result", true);
		}else{
			resultMap.put("result", false);
		}
		return resultMap;
	}
	
	@Override 
	public Map<String, Object> addEqpRegExcel(MultipartFile file) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		// 创建处理EXCEL
		ReadExcelUtils readExcel = new ReadExcelUtils();
		// 解析excel，获取客户信息集合
		List<Eqp> eqpList = readExcel.getExcelInfo(file);
		String sql = "insert into \"MNGT_SYS\".\"EQPREGTBL\"(\"eqpNo\",\"name\", \"assetType\", \"assetValue\", \"securityDomain\", \"workMode\", \"manageMode\", \"os\", \"account\", \"pass\", \"ip\", \"location\", \"serial\", \"contaction\") VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		int result = eqpManageDao.batchInsert(sql, eqpList, Eqp.class);
		if (result > 0) {
			resultMap.put("result", true);
		} else {
			resultMap.put("result", false);
		}
		return resultMap;
	}
}
