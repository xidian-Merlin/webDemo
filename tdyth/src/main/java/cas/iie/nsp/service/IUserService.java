package cas.iie.nsp.service;
import java.util.List;


import cas.iie.nsp.model.Resource;
import cas.iie.nsp.model.User;

public interface IUserService {
    /**
     * 查询指定用户 id 所拥有的权限
     * @param uid
     * @return
     */
    List<Resource> listAllResource(int uid);
    
    /**
     * 登录逻辑
     * 1、先根据用户名查询用户对象
     * 2、如果有用户对象，则继续匹配密码
     * 如果没有用户对象，则抛出异常
     * @param username
     * @param password
     * @return
     */
    User login(String username,String password);
    /**
     * 查询指定用户所指定的角色字符串列表
     * @param uid
     * @return
     */
    List<String> listRoleSnByUser(int uid);
  
}