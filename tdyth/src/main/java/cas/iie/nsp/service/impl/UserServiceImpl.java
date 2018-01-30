package cas.iie.nsp.service.impl;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import cas.iie.nsp.dao.IUserDao;
import cas.iie.nsp.model.Resource;
import cas.iie.nsp.model.User;
import cas.iie.nsp.service.IUserService;

import org.apache.shiro.authc.UnknownAccountException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service("UserServiceImpl")
public class UserServiceImpl extends BaseServiceImpl<User> implements IUserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    IUserDao userDao;
    /**
     * 查询指定用户 id 所拥有的权限
     * @param uid
     * @return
     */
    @Override
    public List<Resource> listAllResource(int userId) {
    	List<Resource> list =new ArrayList<Resource>();
    	List<Map<String,Object>> mapList=userDao.findList("SELECT * FROM ssm_shiro.t_user_role WHERE user_id =(SELECT id FROM ssm_shiro.t_user WHERE username =\"admin\")", new Object[]{userId});
    	for (Map<String, Object> map : mapList) {
    		Resource resource=new Resource();
    		resource.setId((Integer)map.get("id"));
    		resource.setName((String)map.get("name"));
    		resource.setPermission((String)map.get("permission"));
    		resource.setUrl((String)map.get("url"));
    		list.add(resource);
		}
    	return list;
    }
    
    /**
     * 登录逻辑
     * 1、先根据用户名查询用户对象
     * 2、如果有用户对象，则继续匹配密码
     * 如果没有用户对象，则抛出异常
     * @param username
     * @param password
     * @return
     */
    @Override
    public User login(String username, String password) {
    	Map<String,Object> map =userDao.find("SELECT * FROM MNGT_SYS.USERLIST WHERE \"userName\" = ?",new Object[]{username});
    	// 密码匹配的工作交给 Shiro 去完成
        if(map == null){
            // 因为缓存切面的原因,在这里就抛出用户名不存在的异常
            throw new UnknownAccountException("用户名或密码不正确)");
        }
        User user=new User();
    	user.setUserId((Integer)map.get("userId"));
    	user.setUserName((String)map.get("userName"));
    	user.setDescription((String)map.get("description"));
    	user.setUserLevels((Integer)map.get("userLevels"));
    	user.setUserPassword((String)map.get("userPassword"));
        return user;
    }
    
    /**
     * 查询指定用户所指定的角色字符串列表
     * @param uid
     * @return
     */
    @Override
    public List<String> listRoleSnByUser(int userId) {
    	List<String> list =new ArrayList<String>();
    	List<Map<String,Object>> roleIdList=userDao.findList("SELECT \"roleName\" FROM MNGT_SYS.ROLELIST where \"roleId\" in(select \"roleId\" from MNGT_SYS.USERROLESECDOMAIN where \"userId\" = ?)", new Object[]{userId});
    	for (Map<String, Object> map : roleIdList) {
    		list.add((String)map.get("roleName"));
		}
    	return list;
    }
}