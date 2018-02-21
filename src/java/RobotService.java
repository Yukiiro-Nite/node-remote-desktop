import java.awt.Robot;
import java.awt.Point;
import java.awt.event.InputEvent;
import java.awt.Toolkit;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.ObjectInputStream;
import java.lang.reflect.Field;
import java.io.Serializable;
import java.util.Arrays;
import java.io.File;
import javax.imageio.ImageIO;

class MouseMoveEvent implements Serializable {
  private static final long serialVersionUID = 10L;
  public int x = 0;
  public int y = 0;
}

class MouseDownEvent implements Serializable {
  private static final long serialVersionUID = 11L;
  public int x = 0;
  public int y = 0;
  public int key = 0;
}

class MouseUpEvent implements Serializable {
  private static final long serialVersionUID = 12L;
  public int x = 0;
  public int y = 0;
  public int key = 0;
}

class KeyDownEvent implements Serializable {
  private static final long serialVersionUID = 13L;
  public int key = 'A';
}

class KeyUpEvent implements Serializable {
  private static final long serialVersionUID = 14L;
  public int key = 'A';
}

class ScreenCapture {
  private int width;
  private int height;
  private int[] data;

  public ScreenCapture(int width, int height, BufferedImage data) {
    this.width = width;
    this.height = height;
    this.data = new int[width * height];
    data.getRGB(0, 0, width, height, this.data, 0, width);
  }

  public String toString() {
    String s = "";
    String serializedData = "screen.gif";

    // for(int i=0; i < 10; i++) {
    //   serializedData += "\"" + this.data[i] + "\"" + ",";
    // }
    //
    // serializedData = serializedData.substring(0, serializedData.length() - 1);
    //
    // System.err.println(this.data.length);

    s = String.format("{" +
      "\"type\":\"screen-size\"," +
      "\"width\":%d," +
      "\"height\":%d," +
      "\"data\":\"%s\"" +
    "}", width, height, serializedData);

    return s;
  }
}


public class RobotService {
  public static int x = 0;
  public static int y = 0;
  public static Rectangle screenRect;
  public static int width;
  public static int height;
  public static Point prev;
  public static void main(String[] args) throws Exception {
    Robot robot = new Robot();

    screenRect = new Rectangle(Toolkit.getDefaultToolkit().getScreenSize());
    width = (int) screenRect.getWidth();
    height = (int) screenRect.getHeight();
    sendScreenSize(robot);

//    saveImage(robot);

    while(true) {
      ObjectInputStream inputStream = new ObjectInputStream(System.in);
      Object obj = inputStream.readObject();
      prev = java.awt.MouseInfo.getPointerInfo().getLocation();
      doRobotAction(obj, robot);
    }
  }

  public static void sendScreenSize(Robot robot) {
    BufferedImage image = robot.createScreenCapture(screenRect);
    ScreenCapture imageData = new ScreenCapture(width, height, image);
    System.out.println(imageData);
  }

  public static void saveImage(Robot robot) throws Exception {
    BufferedImage image = robot.createScreenCapture(screenRect);
    ScreenCapture imageData = new ScreenCapture(width, height, image);

    File outputfile = new File("screen.gif");
    ImageIO.write(image, "gif", outputfile);
  }

  public static void doRobotAction(Object action, Robot robot) throws Exception {
    String actionName = action.getClass().getSimpleName();
    switch(actionName) {
      case "MouseMoveEvent":
        doMouseMove((MouseMoveEvent) action, robot);
        break;
      case "MouseDownEvent":
        doMouseDown((MouseDownEvent) action, robot);
        break;
      case "MouseUpEvent":
        doMouseUp((MouseUpEvent) action, robot);
        break;
      case "KeyDownEvent":
        doKeyDown((KeyDownEvent) action, robot);
        break;
      case "KeyUpEvent":
        doKeyUp((KeyUpEvent) action, robot);
        break;
    }
  }

  public static void doMouseMove(MouseMoveEvent event, Robot robot) throws Exception {
    x = event.x;
    y = event.y;
    robot.mouseMove(event.x, event.y);
  }

  public static void doMouseDown(MouseDownEvent event, Robot robot) throws Exception {
    robot.mouseMove(event.x, event.y);
    robot.mousePress(InputEvent.getMaskForButton(event.key + 1));
  }

  public static void doMouseUp(MouseUpEvent event, Robot robot) throws Exception {
    robot.mouseMove(event.x, event.y);
    robot.mouseRelease(InputEvent.getMaskForButton(event.key + 1));
  }

  public static void doKeyDown(KeyDownEvent event, Robot robot) throws Exception {
    try {
      robot.keyPress(event.key);
    } catch(Exception e) {
      System.err.println("Problem with keyDown for char: " + event.key);
    }
  }

  public static void doKeyUp(KeyUpEvent event, Robot robot) throws Exception {
    try {
      robot.keyRelease(event.key);
    } catch(Exception e) {
      System.err.println("Problem with keyUp for char: " + event.key);
    }
  }
}
