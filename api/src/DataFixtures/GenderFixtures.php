<?php

namespace App\DataFixtures;

use App\Entity\Gender;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class GenderFixtures extends Fixture
{
    const GENDER_REFERENCE = 'gender';
    const GENDER_ARRAY = ['Homme', 'Femme', 'Non binaire'];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i <= count(self::GENDER_ARRAY) - 1; $i++) {
            $gender = new Gender();
            $gender->setLabel(self::GENDER_ARRAY[$i]);
            $manager->persist($gender);
            $this->addReference(
                sprintf('%s%d', self::GENDER_REFERENCE, $i + 1),
                $gender
            );
        }

        $manager->flush();
    }
}
