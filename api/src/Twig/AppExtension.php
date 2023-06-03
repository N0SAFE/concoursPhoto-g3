<?php
// src/Twig/AppExtension.php
namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension
{
    private $baseUrl;
    private $baseUrlClient;

    public function __construct(string $baseUrl, string $baseUrlClient)
    {
        $this->baseUrl = $baseUrl;
        $this->baseUrlClient = $baseUrlClient;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('base_url', [$this, 'getBaseUrl']),
            new TwigFunction('base_url_client', [$this, 'getBaseUrlClient']),
        ];
    }

    public function getBaseUrl()
    {
        return $this->baseUrl;
    }

    public function getBaseUrlClient()
    {
        return $this->baseUrlClient;
    }
}
