package cas.iie.nsp.model;

public class Index {
	private String height;
	private String weight;
	public String getHeight() {
		return height;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public String getWeight() {
		return weight;
	}
	public void setWeight(String weight) {
		this.weight = weight;
	}
	public Index(String height, String weight) {
		super();
		this.height = height;
		this.weight = weight;
	}
	public Index() {
		super();
	}
	@Override
	public String toString() {
		return "Index [height=" + height + ", weight=" + weight + "]";
	}

}
