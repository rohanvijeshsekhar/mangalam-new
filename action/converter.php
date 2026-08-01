<?php
class CurrencyConverter
{
    // Class properties
    private $endpoint;
    private $curl;
    private $from;
    private $to;
    private $amount;
    private $apikey;

    // Constructor to initialize class properties
    public function __construct($from, $to, $amount)
    {
        // Assign values to class properties
        $this->from   = $from;
        $this->to     = $to;
        $this->endpoint = 'convert';
        $this->amount = $amount;
        $this->apikey = "ed00d710261748fe47fc50a5a1072046";
        $this->curl   = curl_init();
    }

    // Function to convert currency
    public function convert()
    {
        // initialize CURL:
        $ch = curl_init('https://api.exchangeratesapi.io/v1/' . $this->endpoint . '?access_key=' . $this->apikey . '&from=' . $this->from . '&to=' . $this->to . '&amount=' . $this->amount . '');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // get the JSON data:
        $json = curl_exec($ch);
        curl_close($ch);

        // Decode JSON response:
        $conversionResult = json_decode($json, true);
   
        // access the conversion result
        return $conversionResult['result'];
    }
}
