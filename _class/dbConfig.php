<?php


error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);


class dbConfig
{
    // Use p:localhost on Hostinger shared hosting — reuses connections
    // and avoids "Operation not permitted" from their connection rate limit.
    private $host     = "p:localhost";
    private $dbName   = "u614850386_mangalam_live";
    private $userName = "u614850386_mangalam_live";
    private $password = "8t~e5TQQV";
    public $con;

    public function getConnection()
    {
        mysqli_report(MYSQLI_REPORT_OFF);
        $this->con = @mysqli_connect($this->host, $this->userName, $this->password, $this->dbName);
        if ($this->con) {
            return $this->con;
        }
        error_log('DB connection failed: ' . mysqli_connect_error());
        return null;
    }
}
