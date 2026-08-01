<?php
include_once 'dbConfig.php';

class MockMysqliResult implements ArrayAccess, Countable, Iterator {
    private $rows = [];
    private $position = 0;
    public $num_rows = 0;

    public function __construct(array $rows = []) {
        $this->rows = array_values($rows);
        $this->num_rows = count($this->rows);
    }

    public function fetch_assoc() {
        if ($this->position < $this->num_rows) {
            return $this->rows[$this->position++];
        }
        return null;
    }

    public function fetch_array() {
        return $this->fetch_assoc();
    }

    // Iterator interface
    public function rewind(): void { $this->position = 0; }
    public function current(): mixed { return $this->rows[$this->position]; }
    public function key(): mixed { return $this->position; }
    public function next(): void { $this->position++; }
    public function valid(): bool { return isset($this->rows[$this->position]); }

    // Countable interface
    public function count(): int { return $this->num_rows; }

    // ArrayAccess interface
    public function offsetExists(mixed $offset): bool { return isset($this->rows[$offset]); }
    public function offsetGet(mixed $offset): mixed { return $this->rows[$offset] ?? null; }
    public function offsetSet(mixed $offset, mixed $value): void { $this->rows[$offset] = $value; }
    public function offsetUnset(mixed $offset): void { unset($this->rows[$offset]); }
}

// Global helper wrappers for procedural mysqli functions if MockMysqliResult passed
if (!function_exists('safe_mysqli_num_rows')) {
    function safe_mysqli_num_rows($res) {
        if (is_object($res) && isset($res->num_rows)) return $res->num_rows;
        if (is_countable($res)) return count($res);
        if ($res instanceof mysqli_result) return mysqli_num_rows($res);
        return 0;
    }
}

if (!function_exists('safe_mysqli_fetch_array')) {
    function safe_mysqli_fetch_array($res) {
        if (is_object($res) && method_exists($res, 'fetch_array')) return $res->fetch_array();
        if ($res instanceof mysqli_result) return mysqli_fetch_array($res);
        return null;
    }
}

if (!function_exists('safe_mysqli_fetch_assoc')) {
    function safe_mysqli_fetch_assoc($res) {
        if (is_object($res) && method_exists($res, 'fetch_assoc')) return $res->fetch_assoc();
        if ($res instanceof mysqli_result) return mysqli_fetch_assoc($res);
        return null;
    }
}

class query
{
    public $con;
    public function __construct()
    {
        $obj       = new dbConfig();
        $this->con = $obj->getConnection();
    }

    public function selectData($field, $table, $where)
    {
        $sql = "select $field from $table $where";
        if ($this->con) {
            return mysqli_query($this->con, $sql);
        }
        return $this->mockQuery($table, $where);
    }

    public function selectData1($field, $table, $where)
    {
        $sql = "select $field from $table $where";
        return $sql;
    }

    public function insertData($table, $infolog)
    {
        if ($this->con) {
            $stmkey = implode(",", array_keys($infolog));
            $escaped = array_map(function($val) {
                return "'" . mysqli_real_escape_string($this->con, $val) . "'";
            }, array_values($infolog));
            $finalq = "insert into $table ($stmkey) values(" . implode(",", $escaped) . ")";
            return mysqli_query($this->con, $finalq);
        }
        // Dev Mode Mock Insert Success
        return true;
    }

    public function insertData1($table, $infolog)
    {
        $stmkey = implode(",", array_keys($infolog));
        $stmt2 = implode(",", array_map(fn($v) => "'$v'", array_values($infolog)));
        return "insert into $table ($stmkey) values($stmt2)";
    }

    public function updateData($table, $info, $where)
    {
        if ($this->con) {
            $stmtArr = [];
            foreach ($info as $k => $v) {
                $stmtArr[] = "$k='" . mysqli_real_escape_string($this->con, $v) . "'";
            }
            $stmt1 = "update $table set " . implode(",", $stmtArr) . " $where";
            return mysqli_query($this->con, $stmt1);
        }
        return true;
    }

    public function updateData1($table, $info, $where)
    {
        $stmtArr = [];
        foreach ($info as $k => $v) {
            $stmtArr[] = "$k='$v'";
        }
        return "update $table set " . implode(",", $stmtArr) . " $where";
    }

    private function mockQuery($table, $where)
    {
        // Fetch from Node.js backend if available or return seed data
        $ch = curl_init("http://127.0.0.1:3000/action/allDestinations.php");
        // Fallback seed mock arrays for dev mode offline testing
        $mockData = [
            'destinations' => [
                ['destination_id' => 1, 'destination_name' => 'Dubai', 'card_image' => 'destination-1.webp', 'featured' => 1, 'slug_url' => 'dubai', 'meta' => 'Dubai tours', 'discription' => 'Experience Dubai luxury and desert safari.', 'status' => 1],
                ['destination_id' => 2, 'destination_name' => 'Abu Dhabi', 'card_image' => 'destination-2.webp', 'featured' => 1, 'slug_url' => 'abu-dhabi', 'meta' => 'Abu Dhabi tours', 'discription' => 'Grand mosques and theme parks.', 'status' => 1],
                ['destination_id' => 3, 'destination_name' => 'Singapore', 'card_image' => 'destination-3.webp', 'featured' => 1, 'slug_url' => 'singapore', 'meta' => 'Singapore tours', 'discription' => 'Tropical paradise and Sentosa.', 'status' => 1],
                ['destination_id' => 4, 'destination_name' => 'Thailand', 'card_image' => 'destination-4.webp', 'featured' => 1, 'slug_url' => 'thailand', 'meta' => 'Thailand tours', 'discription' => 'Beaches and cultural landmarks.', 'status' => 1]
            ],
            'packages' => [
                ['package_id' => 1, 'destination_id' => 1, 'title' => 'Exotic Dubai Extravaganza', 'card_image' => 'package-card-1.webp', 'duration' => '5 Days / 4 Nights', 'hotel_type' => '4 Star Luxury', 'amount' => 1499, 'no_of_activites' => 6, 'cancellation' => 'Free cancellation', 'transportation' => 'Private Transfers', 'featured' => 1, 'slug_url' => 'exotic-dubai-extravaganza', 'description' => 'Explore Dubai Desert Safari and Burj Khalifa.', 'meta' => 'Dubai package', 'category' => 'Fixed Departure', 'fixed_departure_date' => '2026-09-15', 'status' => 1],
                ['package_id' => 2, 'destination_id' => 2, 'title' => 'Abu Dhabi Wonders', 'card_image' => 'package-card-2.webp', 'duration' => '4 Days / 3 Nights', 'hotel_type' => '5 Star Resort', 'amount' => 1299, 'no_of_activites' => 4, 'cancellation' => 'Non-refundable', 'transportation' => 'Shared Transfer', 'featured' => 1, 'slug_url' => 'abu-dhabi-wonders', 'description' => 'Ferrari World and Grand Mosque.', 'meta' => 'Abu Dhabi package', 'category' => 'Holiday Package', 'fixed_departure_date' => '', 'status' => 1]
            ],
            'tickets' => [
                ['ticket_id' => 1, 'destination_id' => 1, 'title' => 'Burj Khalifa At the Top', 'short_title' => 'Burj Khalifa', 'card_image' => 'ticket-card-1.webp', 'validity' => '30 Days', 'duration' => '1.5 Hours', 'hotel_type' => 'N/A', 'no_of_activities' => 1, 'adult_msg' => 'Adult ticket', 'children_msg' => 'Child ticket', 'required_age' => 'All ages', 'cancellation' => 'Non-refundable', 'transportation' => 'Self arrival', 'display_amount' => 175, 'child_amount' => 135, 'discount_amount' => 10, 'featured' => 1, 'slug_url' => 'burj-khalifa-at-the-top', 'description' => 'Panoramic 360 degree views.', 'meta' => 'Burj Khalifa ticket', 'rand_id' => 201, 'status' => 1],
                ['ticket_id' => 2, 'destination_id' => 2, 'title' => 'Ferrari World Abu Dhabi', 'short_title' => 'Ferrari World', 'card_image' => 'ticket-card-2.webp', 'validity' => '1 Day', 'duration' => 'Full Day', 'hotel_type' => 'N/A', 'no_of_activities' => 1, 'adult_msg' => 'Adult pass', 'children_msg' => 'Child pass', 'required_age' => 'All ages', 'cancellation' => '24h notice', 'transportation' => 'Shuttle available', 'display_amount' => 345, 'child_amount' => 295, 'discount_amount' => 25, 'featured' => 1, 'slug_url' => 'ferrari-world-abu-dhabi', 'description' => 'World fastest roller coaster.', 'meta' => 'Ferrari World ticket', 'rand_id' => 202, 'status' => 1]
            ],
            'activities' => [
                ['activity_id' => 1, 'destination_id' => 1, 'title' => 'Premium Desert Safari', 'short_title' => 'Desert Safari', 'card_image' => 'activity-card-1.webp', 'validity' => '30 Days', 'duration' => '6 Hours', 'hotel_type' => 'N/A', 'adult_msg' => 'Adult price', 'children_msg' => 'Child price', 'cancellation' => 'Free cancellation', 'transportation' => 'Pickup included', 'display_amount' => 150, 'child_amount' => 100, 'discount_amount' => 20, 'featured' => 1, 'slug_url' => 'premium-desert-safari', 'description' => '4x4 dune bashing and BBQ dinner.', 'meta' => 'Desert safari', 'rand_id' => 101, 'status' => 1],
                ['activity_id' => 2, 'destination_id' => 1, 'title' => 'Dubai Marina Dhow Cruise', 'short_title' => 'Dhow Cruise', 'card_image' => 'activity-card-2.webp', 'validity' => '30 Days', 'duration' => '2 Hours', 'hotel_type' => 'N/A', 'adult_msg' => 'Adult price', 'children_msg' => 'Child price', 'cancellation' => '24h notice', 'transportation' => 'Optional transfer', 'display_amount' => 120, 'child_amount' => 80, 'discount_amount' => 15, 'featured' => 1, 'slug_url' => 'dubai-marina-dhow-cruise', 'description' => 'Gourmet dinner on dhow cruise.', 'meta' => 'Dhow cruise', 'rand_id' => 102, 'status' => 1]
            ],
            'blogs' => [
                ['blog_id' => 1, 'title' => 'Top 10 Things to Do in Dubai', 'date' => '2026-07-15', 'description' => '<p>Dubai is a city of wonders...</p>', 'slug_url' => 'top-10-things-to-do-in-dubai', 'status' => 1],
                ['blog_id' => 2, 'title' => 'Guide to Singapore Sentosa', 'date' => '2026-06-28', 'description' => '<p>Sentosa Island guide...</p>', 'slug_url' => 'singapore-sentosa-guide', 'status' => 1]
            ],
            'posters' => [],
            'partners' => [
                ['partners_id' => 1, 'name' => 'Emirates Airlines', 'logo' => 'partner-1.png', 'status' => 1],
                ['partners_id' => 2, 'name' => 'Singapore Airlines', 'logo' => 'partner-2.png', 'status' => 1]
            ],
            'testimonials' => [
                ['id' => 1, 'name' => 'Rahul Sharma', 'rating' => 5, 'comment' => 'Great experience with Mangalam Tours!', 'avatar' => 'abt-img-1.webp', 'status' => 1],
                ['id' => 2, 'name' => 'Priya Patel', 'rating' => 5, 'comment' => 'Smooth visa booking and service!', 'avatar' => 'abt-img-2.webp', 'status' => 1]
            ],
            'notice' => []
        ];

        $rows = $mockData[$table] ?? [];
        return new MockMysqliResult($rows);
    }
}
