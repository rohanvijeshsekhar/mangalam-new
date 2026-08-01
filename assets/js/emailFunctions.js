// Email Functions for Mangalam Tours Frontend
// Similar to Mangalam Tours email system

// Function to send cart enquiry email
function sendCartEnquiryEmail(
  customerName,
  customerEmail,
  customerPhone,
  cartItems,
  totalAmount,
  currencyType = "AED",
) {
  const emailData = {
    enquiry_type: "cart",
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    cart_items: cartItems,
    total_amount: totalAmount,
    currency_type: currencyType,
  };

  return fetch("./action/emailApi.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Cart enquiry emails sent successfully");
        return true;
      } else {
        console.error("Failed to send cart enquiry emails:", data.message);
        return false;
      }
    })
    .catch((error) => {
      console.error("Error sending cart enquiry emails:", error);
      return false;
    });
}

// Function to send activity enquiry email
function sendActivityEnquiryEmail(
  customerName,
  customerEmail,
  customerPhone,
  activityData,
  totalAmount,
  currencyType = "AED",
) {
  const emailData = {
    enquiry_type: "activity",
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    activity_data: activityData,
    total_amount: totalAmount,
    currency_type: currencyType,
  };

  return fetch("./action/emailApi.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Activity enquiry emails sent successfully");
        return true;
      } else {
        console.error("Failed to send activity enquiry emails:", data.message);
        return false;
      }
    })
    .catch((error) => {
      console.error("Error sending activity enquiry emails:", error);
      return false;
    });
}

// Function to send ticket enquiry email
function sendTicketEnquiryEmail(
  customerName,
  customerEmail,
  customerPhone,
  ticketData,
  totalAmount,
  currencyType = "AED",
) {
  const emailData = {
    enquiry_type: "ticket",
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    ticket_data: ticketData,
    total_amount: totalAmount,
    currency_type: currencyType,
  };

  return fetch("./action/emailApi.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Ticket enquiry emails sent successfully");
        return true;
      } else {
        console.error("Failed to send ticket enquiry emails:", data.message);
        return false;
      }
    })
    .catch((error) => {
      console.error("Error sending ticket enquiry emails:", error);
      return false;
    });
}

// Function to send package enquiry email
function sendPackageEnquiryEmail(
  customerName,
  customerEmail,
  customerPhone,
  packageData,
  totalAmount,
  currencyType = "AED",
) {
  const emailData = {
    enquiry_type: "package",
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    package_data: packageData,
    total_amount: totalAmount,
    currency_type: currencyType,
  };

  return fetch("./action/emailApi.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Package enquiry emails sent successfully");
        return true;
      } else {
        console.error("Failed to send package enquiry emails:", data.message);
        return false;
      }
    })
    .catch((error) => {
      console.error("Error sending package enquiry emails:", error);
      return false;
    });
}

// Function to show email success message
function showEmailSuccessMessage() {
  // Create success notification
  const notification = document.createElement("div");
  notification.className = "email-success-notification";
  notification.innerHTML =
    '<i class="fi fi-rr-mail"></i> &nbsp; Email sent successfully!';
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Function to show email error message
function showEmailErrorMessage(message) {
  // Create error notification
  const notification = document.createElement("div");
  notification.className = "email-error-notification";
  notification.innerHTML =
    '<i class="fi fi-rr-cross-circle"></i> &nbsp; ' + message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Make functions globally available
window.sendCartEnquiryEmail = sendCartEnquiryEmail;
window.sendActivityEnquiryEmail = sendActivityEnquiryEmail;
window.sendTicketEnquiryEmail = sendTicketEnquiryEmail;
window.sendPackageEnquiryEmail = sendPackageEnquiryEmail;
window.showEmailSuccessMessage = showEmailSuccessMessage;
window.showEmailErrorMessage = showEmailErrorMessage;
