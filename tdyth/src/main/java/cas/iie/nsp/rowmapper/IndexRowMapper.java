package cas.iie.nsp.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;


import org.springframework.jdbc.core.RowMapper;

import cas.iie.nsp.model.Index;

public class IndexRowMapper  implements RowMapper<Index>{

	@Override
	public Index mapRow(ResultSet rs, int rowNum) throws SQLException {
		// TODO Auto-generated method stub
		return null;
	}

}
