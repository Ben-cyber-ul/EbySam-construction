<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input
    $name = str_replace(array("\r", "\n"), '', strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $address = strip_tags(trim($_POST["address"]));
    $subject = str_replace(array("\r", "\n"), '', strip_tags(trim($_POST["subject"])));
    $message = strip_tags(trim($_POST["message"]));

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    // Email configuration
    $recipient = "ebenezerchibuzor3@gmail.com"; // REPLACE THIS with your actual email address
    $email_subject = "New Contact from $name: $subject";
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Address: $address\n\n";
    $email_content .= "Message:\n$message\n";
    $email_headers = "From: $name <support@ebysamconstruction.com>\r\n";
    $email_headers .= "Reply-To: $email\r\n";

    // Send email
    if (mail($recipient, $email_subject, $email_content, $email_headers)) {
        http_response_code(200);
    } else {
        http_response_code(500);
    }
} else {
    http_response_code(403);
}
?>