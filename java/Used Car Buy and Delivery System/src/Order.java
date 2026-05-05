public class Order {
    private int orderId;
    private String username;
    private int carId;
    private String status;

    public Order(int orderId, String username, int carId) {
        this.orderId = orderId;
        this.username = username;
        this.carId = carId;
        this.status = "PURCHASED";
    }

    public int getOrderId() { return orderId; }
    public String getUsername() { return username; }
    public int getCarId() { return carId; }
    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return "OrderID: " + orderId +
                " | User: " + username +
                " | CarID: " + carId +
                " | Status: " + status;
    }
}