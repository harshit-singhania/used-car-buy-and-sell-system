import java.util.Scanner;

public class Man {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        Service service = new Service();

        while (true) {

            System.out.println("\n===== USED CAR SYSTEM =====");

            if (!service.hasActiveSession()) {
                // Only show allowed options
                System.out.println("1. Register");
                System.out.println("2. Login");
                System.out.println("12. Exit");
            } else {
                // Full menu after login
                System.out.println("1.Register 2.Login 3.AddCar 4.Browse");
                System.out.println("5.ViewCar 6.BuyCar 7.Wishlist");
                System.out.println("8.Recent 9.MyOrders 10.AllOrders");
                System.out.println("11.Logout 12.Exit");
                System.out.println("13.Compare 14.Popular 15.Feedback 16.ViewFeedback");
            }

            int ch = sc.nextInt();

            // GLOBAL PROTECTION (MAIN FIX)
            if (!service.hasActiveSession() && ch != 1 && ch != 2 && ch != 12) {
                System.out.println("Please login first! Only Register/Login allowed.");
                continue;
            }

            switch (ch) {

                case 1:
                    sc.nextLine();
                    System.out.print("Username: ");
                    String u = sc.nextLine();
                    System.out.print("Password: ");
                    String p = sc.nextLine();
                    System.out.print("Role: ");
                    String r = sc.nextLine();
                    service.registerUser(u, p, r);
                    break;

                case 2:
                    sc.nextLine();
                    System.out.print("Username: ");
                    String lu = sc.nextLine();
                    System.out.print("Password: ");
                    String lp = sc.nextLine();
                    service.login(lu, lp);
                    break;

                case 3:
                    System.out.print("ID: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    System.out.print("Brand: ");
                    String b = sc.nextLine();
                    System.out.print("Model: ");
                    String m = sc.nextLine();
                    System.out.print("Price: ");
                    double pr = sc.nextDouble();
                    service.addCar(id, b, m, pr);
                    break;

                case 4:
                    service.browseCars();
                    break;
                case 5:
                    service.viewCar(sc.nextInt());
                    break;
                case 6:
                    service.purchaseCar(sc.nextInt());
                    break;

                case 7:
                    System.out.println("1.Add 2.Remove 3.View");
                    int w = sc.nextInt();
                    if (w == 1)
                        service.addToWishlist(sc.nextInt());
                    else if (w == 2)
                        service.removeFromWishlist(sc.nextInt());
                    else
                        service.viewWishlist();
                    break;

                case 8:
                    service.viewRecentCars();
                    break;
                case 9:
                    service.viewMyOrders();
                    break;
                case 10:
                    service.viewAllOrders();
                    break;
                case 11:
                    service.logout();
                    break;

                case 12:
                    System.out.println("Exit...");
                    return;

                case 13:
                    System.out.print("Enter Car1 ID: ");
                    int c1 = sc.nextInt();
                    System.out.print("Enter Car2 ID: ");
                    int c2 = sc.nextInt();
                    service.compareCars(c1, c2);
                    break;

                case 14:
                    service.viewPopularCars();
                    break;

                case 15:
                    sc.nextLine();
                    System.out.print("Enter feedback: ");
                    String fb = sc.nextLine();
                    service.submitFeedback(fb);
                    break;

                case 16:
                    service.viewFeedbacks();
                    break;
                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}
