package cas.iie.nsp.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import cas.iie.nsp.model.Eqp;

/**
 * @author chenpx
 */
public interface IEqpManageService extends IBaseService<Object> {
	
	/*****************************设备类型*************************************/
	/**
	 * 获取设备type类型列表
	 * @param currentPage当前页数
	 * @param numPerPage 每页大小
	 * @return 记录的总条数，List数据
	 */
	public Map<String, Object> getEqpTypeList(int currentPage,int numPerPage);
	
	/**
	 * 设备类型新增,编辑,当operateType为新增时，eqpTypeId默认为-1
	 * @param operateType 操作类型
	 * @param eqpClassId 设备class
	 * @param eqpTypeId 设备类型id(新增时不需要)
	 * @param eqpTypeName 设备类型名字
	 * @return true或者false
	 */
	public boolean eqpTypeModify(int operateType, int eqpClassId, int eqpTypeId, String eqpTypeName,String eqpTypePicName);
	
	/**
	 * 设备类型删除
	 * @param eqpTypeIds 设备类型id组成的字符串
	 * @return true或者false
	 */
	public boolean eqpTypeDelete(String eqpTypeIds);
	
	/**
	 * 获取设备class的下拉列表
	 * @return 
	 */
	public List<Map<String,Object>> getEqpClassList();
	
	
	/*****************************设备安全域*************************************/
	/**
	 * 获取设备安全域列表
	 * @param currentPage当前页数
	 * @param numPerPage 每页大小
	 * @return 记录的总条数，List数据
	 */
	public Map<String,Object> getSecDomList(int currentPage,int numPerPage);
	
	/**
	 * 设备安全域新增,编辑
	 * @param operateType 操作类型 ,当operateType为新增时，eqpSecDomId默认为-1
	 * @param eqpSecDomId  安全域id
	 * @param eqpSecDomName 安全域名字
	 * @param eqpSecDomDesc 安全域描述
	 * @return true或者false
	 */
	public boolean eqpSecDomModify(int operateType,int eqpSecDomId,String eqpSecDomName,String eqpSecDomDesc);
	
	/**
	 * 设备安全域删除（批量删除）
	 * @param eqpSecDomIds 设备安全域id组成的字符串
	 * @return true或者false
	 */
	public boolean eqpSecDomDelete(String eqpSecDomIds);
	
	
	
	/*****************************设备安全域*************************************/
	/**
	 * 获取登记设备的列表
	 * @param currentPage当前页数
	 * @param numPerPage 每页大小
	 * @return 记录的总条数，List数据
	 */
	public Map<String,Object> getEqpRegList(int currentPage,int numPerPage);
	
	/**
	* 登记批量excel上传
	* @return true or false
	*/
	public Map<String,Object> addEqpRegExcel(MultipartFile file);
	
	/**
	 * 登记批量manul上传
	 * @return true or false
	 */
	public Map<String,Object> addEqpRegManual(Eqp eqp);
}
