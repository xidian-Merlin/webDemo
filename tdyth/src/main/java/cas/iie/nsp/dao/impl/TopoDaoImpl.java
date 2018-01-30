package cas.iie.nsp.dao.impl;

import org.springframework.stereotype.Repository;

import cas.iie.nsp.dao.ITopoDao;
import cas.iie.nsp.model.TopoNode;

@Repository("topoDao")
public class TopoDaoImpl extends BaseDaoImpl<TopoNode> implements ITopoDao{

}
