<?php

namespace App\DataFixtures;

use App\Entity\ParticipantCategory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ParticipantCategoryFixtures extends Fixture
{
    const PARTICIPANT_CATEGORY_REFERENCE = 'participant_category';
    const PARTICIPANT_CATEGORY_ARRAY = [
        'Amateur',
        'Débutant',
        'Intermédiaire',
        'Professionel',
    ];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i <= count(self::PARTICIPANT_CATEGORY_ARRAY) - 1; $i++) {
            $participant_category = new ParticipantCategory();
            $participant_category->setLabel(
                self::PARTICIPANT_CATEGORY_ARRAY[$i]
            );
            $manager->persist($participant_category);
            $this->addReference(
                sprintf('%s%d', self::PARTICIPANT_CATEGORY_REFERENCE, $i + 1),
                $participant_category
            );
        }

        $manager->flush();
    }
}
