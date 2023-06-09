<?php

namespace App\DataFixtures;

use App\Entity\Theme;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ThemeFixtures extends Fixture
{
    const THEME_REFERENCE = 'theme';
    const THEME_ARRAY = [
        'Aventure',
        'Young Adult',
        'Jeunesse',
        'Fantastique',
        'Science-Fiction',
        'Policier',
    ];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i <= count(self::THEME_ARRAY) - 1; $i++) {
            $theme = new Theme();
            $theme->setLabel(self::THEME_ARRAY[$i]);
            $manager->persist($theme);
            $this->addReference(
                sprintf('%s%d', self::THEME_REFERENCE, $i + 1),
                $theme
            );
        }

        $manager->flush();
    }
}
