//FOR HOME BUTTON ON INDEX PAGE
document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('home');
    
    if (homeButton) {
        homeButton.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent the default link action
            
            // You can add any code here that you want to run when the "Home" button is clicked
            console.log('Home button clicked!');
            
            // For example, smooth scrolling to a specific section
            window.scrollTo({
                top: window.scrollY + 560, 
                behavior: "smooth"
            });
        });
    }
});
