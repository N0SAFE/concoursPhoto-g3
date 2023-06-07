<?php

namespace App\DataFixtures;

use App\Entity\SocialNetworks;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SocialNetworksFixtures extends Fixture
{
    const SN_REFERENCE = 'social_networks';
    const SN_ARRAY = [
        "Facebook", 
        "Youtube",
        "Instagram", 
        "Twitter",
        "LinkedIn",
        "TikTok"
    ];

    public function load(ObjectManager $manager): void
    {

        for ($i = 0; $i <= count(self::SN_ARRAY) - 1; $i++) {
            $social_networks = new SocialNetworks();
            $social_networks->setLabel(self::SN_ARRAY[$i]);
            $manager->persist($social_networks);
            $this->addReference(sprintf('%s%d', self::SN_REFERENCE, $i + 1), $social_networks);
        }

        $manager->flush();
    }
}
