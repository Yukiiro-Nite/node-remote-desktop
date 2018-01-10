import java.awt.Robot;
import java.awt.Point;
import java.awt.event.InputEvent;
import java.awt.Toolkit;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.io.ObjectInputStream;
import java.lang.reflect.Field;
import java.io.Serializable;

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


public class RobotService {
  public static int x = 0;
  public static int y = 0;
  public static Point prev;
  public static void main(String[] args) throws Exception {
    Dimension screenDim = Toolkit.getDefaultToolkit().getScreenSize();
    Robot robot = new Robot();
    System.out.println("{\"Hello\":\"world\"}");
    while(true) {
      ObjectInputStream inputStream = new ObjectInputStream(System.in);
      Object obj = inputStream.readObject();
      prev = java.awt.MouseInfo.getPointerInfo().getLocation();
      doRobotAction(obj, robot);
    }
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
    robot.keyPress(event.key);
  }

  public static void doKeyUp(KeyUpEvent event, Robot robot) throws Exception {
    robot.keyRelease(event.key);
  }
}
