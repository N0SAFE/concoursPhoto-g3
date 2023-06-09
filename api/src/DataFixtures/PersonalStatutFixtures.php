<?php

namespace App\DataFixtures;

use App\Entity\Gender;
use App\Entity\PersonalStatut;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PersonalStatutFixtures extends Fixture
{
    const PERSONAL_STATUT_REFERENCE = 'personal_statut';
    const PERSONAL_STATUT_ARRAY = ['Etudiant', 'Enseignant', 'Employé'];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i <= count(self::PERSONAL_STATUT_ARRAY) - 1; $i++) {
            $personal_statut = new PersonalStatut();
            $personal_statut->setLabel(self::PERSONAL_STATUT_ARRAY[$i]);
            $manager->persist($personal_statut);
            $this->addReference(
                sprintf('%s%d', self::PERSONAL_STATUT_REFERENCE, $i + 1),
                $personal_statut
            );
        }

        $manager->flush();
    }
}
