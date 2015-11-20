<?
  require 'config.php';
  // the config file contains data that should not
  // be pushed to github (e.g. database)

  $method = $_SERVER['REQUEST_METHOD'];
  if ($method == 'POST') {
    $email = $_POST['email'];
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
      // valid email

      // using the email as the key for the JSON. 
      // Strip out characters that usually are in emails. 
      $emailReplaced = str_replace(".", "_DOT_", $email);
      $emailReplaced = str_replace("@", "_AT_", $emailReplaced);
      $emailReplaced = str_replace("#", "_OCTOTHORP", $emailReplaced);
      $emailReplaced = str_replace("$", "_DOLLAR_", $emailReplaced);
      $emailReplaced = str_replace("[", "_LSBK_", $emailReplaced);
      $emailReplaced = str_replace("]", "_RSBK_", $emailReplaced);

      if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
      } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
      } else {
        $ip = $_SERVER['REMOTE_ADDR'];
      }

      $data = "'{\"email\":\"".$email."\", \"ip\":\"".$ip."\"}'";
      $execCmd = "curl -X PUT -d " . $data . " ". $DATABASE . "" . $emailReplaced . ".json?auth=" . $SECRET_TOKEN;
      $output = exec($execCmd);

      $arr = array("message"=>"Your email has been submitted!","status"=>"success");
      echo json_encode($arr);

    } else {
      // invalid email
      $arr = array("message"=>"invalid email address","status"=>"error");
      echo json_encode($arr);
    }

  } else {
    // Hello there.
    header('Location: /');
    echo "Now now, play nice.";
  }



?>