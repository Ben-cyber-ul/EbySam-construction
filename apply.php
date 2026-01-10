<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $position = strip_tags(trim($_POST["position"]));
    $message = strip_tags(trim($_POST["message"]));

    if (empty($name) || empty($email) || empty($position)) {
        http_response_code(400);
        echo "Missing required fields.";
        exit;
    }

    // File Upload Handling
    $file_attached = false;
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_name = $_FILES['cv']['tmp_name'];
        $file_name = $_FILES['cv']['name'];
        $file_size = $_FILES['cv']['size'];
        $file_type = $_FILES['cv']['type'];
        
        // Check file size (max 2MB)
        if ($file_size > 2 * 1024 * 1024) {
            http_response_code(400);
            echo "File is too large. Max 2MB.";
            exit;
        }

        $content = file_get_contents($file_tmp_name);
        $encoded_content = chunk_split(base64_encode($content));
        $file_attached = true;
    }

    $recipient = "careers@ebysamconstruction.com";
    $subject = "Job Application: $position - $name";
    $boundary = md5(uniqid(time())); 

    // Headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: $name <support@ebysamconstruction.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // Body
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode("Name: $name\nEmail: $email\nPhone: $phone\nPosition: $position\n\nMessage:\n$message"));

    // Attachment
    if ($file_attached) {
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $encoded_content;
    }
    $body .= "--$boundary--\r\n";

    if (mail($recipient, $subject, $body, $headers)) http_response_code(200);
    else http_response_code(500);
}
?>