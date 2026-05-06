import java.util.*;

public class Service{

    // ================= DATA STORAGE =================
    private ArrayList<User> users = new ArrayList<>();
    private ArrayList<Car> cars = new ArrayList<>();
    private ArrayList<Car> wishlist = new ArrayList<>();
    private ArrayList<Car> recent = new ArrayList<>();
    private ArrayList<Order> orders = new ArrayList<>();
    private ArrayList<String> feedbacks = new ArrayList<>();

    // ================= SESSION =================
    private User loggedInUser = null;
    private int orderCounter = 1;

    // ================= SESSION CHECK =================
    public boolean hasActiveSession() {
        return loggedInUser != null;
    }

    private boolean isLoggedIn() {
        if (loggedInUser == null) {
            System.out.println("Please login first!");
            return false;
        }
        return true;
    }

    // ================= ROLE CHECK =================
    private boolean isAdmin() {
        return loggedInUser != null &&
                loggedInUser.getRole().equalsIgnoreCase("admin");
    }

    private boolean isSeller() {
        return loggedInUser != null &&
                loggedInUser.getRole().equalsIgnoreCase("seller");
    }

    private boolean isBuyer() {
        return loggedInUser != null &&
                loggedInUser.getRole().equalsIgnoreCase("buyer");
    }

    private boolean isAdminOrSeller() {
        return isAdmin() || isSeller();
    }

    // ================= USER =================
    public void registerUser(String username, String password, String role) {

        // Prevent duplicate users
        for (User u : users) {
            if (u.getUsername().equalsIgnoreCase(username)) {
                System.out.println("Username already exists!");
                return;
            }
        }

        users.add(new User(username, password, role));

        // IMPORTANT: clear session after registration
        loggedInUser = null;

        System.out.println("User Registered! Please login.");
    }

    public void deleteUser(String username) {
        if (!isLoggedIn())
            return;

        if (!isAdmin()) {
            System.out.println("Only Admin can delete users!");
            return;
        }

        boolean removed = users.removeIf(u -> u.getUsername().equals(username));

        if (removed)
            System.out.println("User Deleted!");
        else
            System.out.println("User not found!");
    }

    // ================= AUTH =================
    public void login(String username, String password) {

        if (loggedInUser != null) {
            System.out.println("Already logged in as "
                    + loggedInUser.getUsername());
            return;
        }

        for (User u : users) {
            if (u.getUsername().equals(username)
                    && u.getPassword().equals(password)) {

                loggedInUser = u;
                System.out.println("Login Successful as " + u.getRole());
                return;
            }
        }

        System.out.println("Invalid Credentials!");
    }

    public void logout() {

        if (loggedInUser == null) {
            System.out.println("No active session!");
            return;
        }

        System.out.println("Logged out: " + loggedInUser.getUsername());
        loggedInUser = null;
    }

    // ================= CAR =================
    public void addCar(int id, String brand, String model, double price) {

        if (!isLoggedIn())
            return;

        if (!isAdminOrSeller()) {
            System.out.println("Only Admin/Seller can add cars!");
            return;
        }

        // Prevent duplicate ID
        for (Car c : cars) {
            if (c.getId() == id) {
                System.out.println("Car ID already exists!");
                return;
            }
        }

        cars.add(new Car(id, brand, model, price));
        System.out.println("Car Added!");
    }

    public void updateCar(int id, double price) {

        if (!isLoggedIn())
            return;

        if (!isAdminOrSeller()) {
            System.out.println("Access Denied!");
            return;
        }

        for (Car c : cars) {
            if (c.getId() == id) {
                c.setPrice(price);
                System.out.println("Car Updated!");
                return;
            }
        }

        System.out.println("Car not found!");
    }

    public void deleteCar(int id) {

        if (!isLoggedIn())
            return;

        if (!isAdminOrSeller()) {
            System.out.println("Access Denied!");
            return;
        }

        boolean removed = cars.removeIf(c -> c.getId() == id);

        if (removed)
            System.out.println("Car Deleted!");
        else
            System.out.println("Car not found!");
    }

    public void browseCars() {

        if (!isLoggedIn())
            return;

        for (Car c : cars) {
            if (c.isAvailable()) {
                System.out.println(c);
            }
        }
    }

    public void viewCar(int id) {

        if (!isLoggedIn())
            return;

        for (Car c : cars) {
            if (c.getId() == id) {
                c.incrementView(); // NEW
                recent.add(c);
                System.out.println(c);
                return;
            }
        }

        System.out.println("Car not found!");
    }

    // ================= PURCHASE =================
    public void purchaseCar(int id) {

        detectFraud(loggedInUser.getUsername());

        if (!isLoggedIn())
            return;

        if (!isBuyer() && !isAdmin()) {
            System.out.println("Only Buyer/Admin can purchase!");
            return;
        }

        for (Car c : cars) {
            if (c.getId() == id && c.isAvailable()) {

                c.setAvailable(false);

                Order order = new Order(
                        orderCounter++,
                        loggedInUser.getUsername(),
                        id);

                orders.add(order);

                System.out.println("Purchase Successful!");
                System.out.println(order);
                return;
            }
        }

        System.out.println("Car not available!");
    }

    // ================= WISHLIST =================
    public void addToWishlist(int id) {

        if (!isLoggedIn())
            return;

        if (!isBuyer() && !isAdmin()) {
            System.out.println("Access Denied!");
            return;
        }

        for (Car c : cars) {
            if (c.getId() == id) {
                wishlist.add(c);
                System.out.println("Added to Wishlist!");
                return;
            }
        }

        System.out.println("Car not found!");
    }

    public void removeFromWishlist(int id) {

        if (!isLoggedIn())
            return;

        boolean removed = wishlist.removeIf(c -> c.getId() == id);

        if (removed)
            System.out.println("Removed from Wishlist!");
        else
            System.out.println("Car not in wishlist!");
    }

    public void viewWishlist() {

        if (!isLoggedIn())
            return;

        if (wishlist.isEmpty()) {
            System.out.println("Wishlist is empty!");
            return;
        }

        for (Car c : wishlist) {
            System.out.println(c);
        }
    }

    // ================= RECENT =================
    public void viewRecentCars() {

        if (!isLoggedIn())
            return;

        if (recent.isEmpty()) {
            System.out.println("No recent cars!");
            return;
        }

        for (Car c : recent) {
            System.out.println(c);
        }
    }

    // ================= ORDERS =================
    public void viewMyOrders() {

        if (!isLoggedIn())
            return;

        boolean found = false;

        for (Order o : orders) {
            if (o.getUsername().equals(loggedInUser.getUsername())) {
                System.out.println(o);
                found = true;
            }
        }

        if (!found)
            System.out.println("No orders found!");
    }

    public void viewAllOrders() {

        if (!isLoggedIn())
            return;

        if (!isAdmin()) {
            System.out.println("Only Admin allowed!");
            return;
        }

        if (orders.isEmpty()) {
            System.out.println("No orders available!");
            return;
        }

        for (Order o : orders) {
            System.out.println(o);
        }
    }

    public void compareCars(int id1, int id2) {
        if (!isLoggedIn())
            return;

        Car c1 = null, c2 = null;

        for (Car c : cars) {
            if (c.getId() == id1)
                c1 = c;
            if (c.getId() == id2)
                c2 = c;
        }

        if (c1 == null || c2 == null) {
            System.out.println("One or both cars not found!");
            return;
        }

        System.out.println("=== COMPARISON ===");
        System.out.println(c1);
        System.out.println(c2);
    }

    private void detectFraud(String username) {
        int count = 0;

        for (Order o : orders) {
            if (o.getUsername().equals(username)) {
                count++;
            }
        }

        if (count > 3) {
            System.out.println("Fraud Alert: High purchase activity by " + username);
        }
    }

    public void viewPopularCars() {
        if (!isLoggedIn())
            return;

        cars.sort((a, b) -> b.getViewCount() - a.getViewCount());

        System.out.println("Popular Cars:");
        if (cars.size()>=5){
            for(int i =0;i<5;i++){
                System.out.println(cars.get(i));
            }
        }else{
            for( Car c : cars){
                System.out.println(c);
            }
        }

    }

    public void submitFeedback(String msg) {
        if (!isLoggedIn())
            return;

        feedbacks.add(loggedInUser.getUsername() + ": " + msg);
        System.out.println("Feedback submitted!");
    }

    public void viewFeedbacks() {
        if (!isLoggedIn())
            return;

        if (!isAdmin()) {
            System.out.println("Only Admin can view feedback!");
            return;
        }

        if (feedbacks.isEmpty()) {
            System.out.println("No feedback available!");
            return;
        }

        for (String f : feedbacks) {
            System.out.println(f);
        }
    }
}
