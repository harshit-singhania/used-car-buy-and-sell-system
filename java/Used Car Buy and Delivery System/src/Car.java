public class Car {
    private int id;
    private String brand;
    private String model;
    private double price;
    private boolean available;

    public Car(int id, String brand, String model, double price) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.available = true;
    }

    public int getId() {
        return id;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public double getPrice() {
        return price;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    private int viewCount = 0;

    public int getViewCount() {
        return viewCount;
    }

    public void incrementView() {
        this.viewCount++;
    }

    @Override
    public String toString() {
        return id + " | " + brand + " | " + model + " | ₹" + price + " | Available: " + available + " | Views: " + viewCount;
    }
}