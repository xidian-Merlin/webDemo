package cas.iie.nsp.dao.impl;

import org.springframework.stereotype.Repository;

import cas.iie.nsp.dao.IIndexDao;
import cas.iie.nsp.model.Index;

@Repository("indexDao")
public class IndexDaoImpl extends BaseDaoImpl<Index> implements IIndexDao{

}
