package cas.iie.nsp.service;

import java.util.Map;

import cas.iie.nsp.model.Index;

public interface IIndexService extends IBaseService<Index>
{
	Map<String, Object> findUserByName(String param);
}
