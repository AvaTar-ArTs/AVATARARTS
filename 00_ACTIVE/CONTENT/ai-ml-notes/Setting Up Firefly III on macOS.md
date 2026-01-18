To set up the Firefly III financial manager on macOS, especially for development or personal use, you have several options. Given the ease of installation and management provided by Docker, it is generally recommended for quick and straightforward setups; however, since you're focusing on non-Docker setups, I'll guide you through setting Firefly III up using a local development environment with PHP and a database system like MySQL or PostgreSQL. Here’s how you can do it:

### Setting Up Firefly III on macOS

1. **Install Homebrew (if not installed):**

   Homebrew is a package manager for macOS that makes installing software easier. If it's not installed, run:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install PHP:**

   Firefly III requires PHP (preferably PHP 8.1 or later).

   ```bash
   brew install php
   ```

3. **Install Composer:**

   Composer is a dependency manager for PHP, which Firefly III uses.

   ```bash
   brew install composer
   ```

4. **Install Database (MySQL/PostgreSQL):**

   You can choose either MySQL or PostgreSQL. For simplicity, let’s assume MySQL:

   ```bash
   brew install mysql
   ```

   Start MySQL service:

   ```bash
   brew services start mysql
   ```

   Secure MySQL installation (optional but recommended):

   ```bash
   mysql_secure_installation
   ```

5. **Clone Firefly III Repository:**

   Navigate to your desired projects directory and clone the repository.

   ```bash
   git clone https://github.com/firefly-iii/firefly-iii.git
   cd firefly-iii
   ```

6. **Install PHP Dependencies:**

   Run Composer to install the necessary PHP packages:

   ```bash
   composer install
   ```

7. **Set Up Environment Configuration:**

   Copy the `.env.example` to `.env` and fill in the required database information, app key, and other settings. You can generate an app key using:

   ```bash
   php artisan key:generate
   ```

8. **Set File Permissions:**

   Make sure the storage and bootstrap/cache directories are writable by the web server:

   ```bash
   sudo chmod -R 775 storage
   sudo chmod -R 775 bootstrap/cache
   ```

9. **Run Database Migrations:**

   Migrate the database schema:

   ```bash
   php artisan migrate
   ```

10. **Serve the Application:**

    You can serve the application using PHP’s built-in server, suitable for development:

    ```bash
    php artisan serve
    ```

    This will start the server at `http://localhost:8000`, which you can visit in your web browser.

### Important Considerations

- **Production Setup:** For production, you would require more robust environment setups, such as configuring a web server like Nginx or Apache, setting up SSL, and optimizing PHP configurations.
- **Database Security:** Ensure that your database is secure, and user access is properly managed.
- **Environment Variables:** Store sensitive information securely and avoid hardcoding configurations in the `.env` file in your repo.

By setting up Firefly III following the steps above, you can run a local instance on macOS that allows you to manage personal or development finances without the need for Docker. This method provides flexibility and understanding of the underlying infrastructure.