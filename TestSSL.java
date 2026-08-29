import java.net.URL;
import java.net.HttpURLConnection;
import java.io.InputStream;

public class TestSSL {
    public static void main(String[] args) throws Exception {
        URL url = new URL("https://repo.maven.apache.org/maven2/");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.connect();
        System.out.println("Response Code: " + conn.getResponseCode());
    }
}
