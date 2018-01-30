package cas.iie.nsp.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import cas.iie.nsp.model.Eqp;

public class ReadExcelUtils {
	// 总行数
	private int totalRows = 0;
	// 总条数
	private int totalCells = 0;
	// 错误信息接收器
	private String errorMsg;

	// 构造方法
	public ReadExcelUtils() {
	}

	// 获取总行数
	public int getTotalRows() {
		return totalRows;
	}

	// 获取总列数
	public int getTotalCells() {
		return totalCells;
	}

	// 获取错误信息-暂时未用到暂时留着
	public String getErrorInfo() {
		return errorMsg;
	}

	/**
	 * 读EXCEL文件，获取客户信息集合
	 * 
	 * @param fielName
	 * @return
	 */
	public List<Eqp> getExcelInfo(MultipartFile Mfile) {

		// 把spring文件上传的MultipartFile转换成CommonsMultipartFile类型
		CommonsMultipartFile cf = (CommonsMultipartFile) Mfile;
		// 获取本地存储路径
		String storedPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
		// 新建一个文件
		File file = new File(storedPath + File.separator + new Date().getTime() + ".xlsx");
		// 将上传的文件写入新建的文件中
		try {
			cf.getFileItem().write(file);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// 初始化客户信息的集合
		List<Eqp> eqpList = new ArrayList<Eqp>();
		// 初始化输入流
		FileInputStream is = null;
		Workbook wb = null;
		try {
			// 根据新建的文件实例化输入流
			is = new FileInputStream(file);
			// 根据excel里面的内容读取信息
			// 当excel是2003时
			// wb = new HSSFWorkbook(is);
			// 当excel是2007时
			wb = new XSSFWorkbook(is);
			// 读取Excel里面客户的信息
			eqpList = readExcelValue(wb);
			is.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					is = null;
					e.printStackTrace();
				}
			}
		}
		return eqpList;
	}

	/**
	 * 读取Excel里面客户的信息
	 * 
	 * @param wb
	 * @return
	 */
	private List<Eqp> readExcelValue(Workbook wb) {
		// 得到第一个shell
		Sheet sheet = wb.getSheetAt(0);

		// 得到Excel的行数
		this.totalRows = sheet.getPhysicalNumberOfRows();
		// 得到Excel的列数(前提是有行数)
		if (totalRows >= 1 && sheet.getRow(0) != null) {// 判断行数大于一，并且第一行必须有标题（这里有bug若文件第一行没值就完了）
			this.totalCells = sheet.getRow(0).getPhysicalNumberOfCells();
		} else {
			return null;
		}
		List<Eqp> eqpList = new ArrayList<Eqp>();// 声明一个对象集合
		Eqp eqp = null;// 声明一个对象

		// 循环Excel行数,从第二行开始,标题不入库
		boolean flag = true;
		for (int r = 1; r < totalRows && flag; r++) {
			Row row = sheet.getRow(r);
			// 判断当前行的第一列是否有值，没有值就直接停止excel中的信息录入
			if ("" != getValue(row.getCell(0))) {
				eqp = new Eqp();
			} else {
				break;
			}
			// 循环Excel的列
			for (int c = 0; c < this.totalCells; c++) {
				Cell cell = row.getCell(c);
				if (null != cell) {
					if (c == 0) {
						eqp.setEqpNo(getValue(cell));// 得到行中第1个值
					} else if (c == 1 && getValue(cell) != "") {
						eqp.setName(getValue(cell));// 得到行中第2个值
					} else if (c == 2 && getValue(cell) != "") {
						eqp.setAssetType((int) Float.parseFloat(getValue(cell)));// 得到行中第3个值
					} else if (c == 3 && getValue(cell) != "") {
						eqp.setAssetValue(Float.parseFloat(getValue(cell)));// 得到行中第4个值
					} else if (c == 4 && getValue(cell) != "") {
						eqp.setSecurityDomain((int) Float.parseFloat(getValue(cell)));// 得到行中第5个值
					} else if (c == 5 && getValue(cell) != "") {
						eqp.setWorkMode((int) Float.parseFloat(getValue(cell)));// 得到行中第6个值
					} else if (c == 6 && getValue(cell) != "") {
						eqp.setManageMode((int) Float.parseFloat(getValue(cell)));// 得到行中第7个值
					} else if (c == 7 && getValue(cell) != "") {
						eqp.setOs(getValue(cell));// 得到行中第8个值
					} else if (c == 8 && getValue(cell) != "") {
						eqp.setAccount(getValue(cell));// 得到行中第9个值
					} else if (c == 9 && getValue(cell) != "") {
						eqp.setPass(getValue(cell));// 得到行中第10个值
					} else if (c == 10 && getValue(cell) != "") {
						eqp.setIp(getValue(cell));// 得到行中第11个值
					} else if (c == 11 && getValue(cell) != "") {
						eqp.setLocation(getValue(cell));// 得到行中第12个值
					} else if (c == 12 && getValue(cell) != "") {
						eqp.setSerial(getValue(cell));// 得到行中第13个值
					} else if (c == 13 && getValue(cell) != "") {
						eqp.setContaction(getValue(cell));// 得到行中第14个值
					}
				}
			}
			// 添加对象到集合中
			eqpList.add(eqp);
		}
		return eqpList;
	}

	/**
	 * 得到Excel表中的值
	 * 
	 * @param cell
	 *            Excel中的每一个格子
	 * @return Excel中每一个格子中的值
	 */
	@SuppressWarnings("static-access")
	private String getValue(Cell cell) {
		if (cell.getCellType() == cell.CELL_TYPE_BOOLEAN) {
			// 返回布尔类型的值
			return String.valueOf(cell.getBooleanCellValue());
		} else if (cell.getCellType() == cell.CELL_TYPE_NUMERIC) {
			// 返回数值类型的值
			return String.valueOf(cell.getNumericCellValue());
		} else {
			// 返回字符串类型的值
			return String.valueOf(cell.getStringCellValue());
		}
	}

}
