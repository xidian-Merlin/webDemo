package cas.iie.nsp.dao.impl;

import org.springframework.stereotype.Repository;

import cas.iie.nsp.dao.IUserDao;
import cas.iie.nsp.model.User;

@Repository("UserDao")
public class UserDaoImpl extends BaseDaoImpl<User> implements IUserDao {
	
}