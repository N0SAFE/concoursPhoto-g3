<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Form\Extension\Core\Type\CountryType;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->save($user, true);
    }

    // TROUVER UN MOYEN D'AFFICHER TOUTES LES COMPETITIONS OU L'UTILISATEUR A POSTER UNE PHOTO MAIS AUSSI LES COMPETITIONS OU IL A VOTE EN MÊME TEMPS
    public function getCompetitionsParticipates(User $user): array {
        // select all competitions where user have posted a picture
        return $this->createQueryBuilder('u')
            ->select('c.competition_name', 'c.id', 'c.submission_start_date', 'c.submission_end_date', 'c.state', 'c.results_date', 'COUNT(p.id) AS number_of_pictures')
            ->join('u.pictures', 'p')
            ->join('p.competition', 'c')
            ->where('u.id = :id')
            ->setParameter('id', $user->getId())
            ->orderBy('c.competition_name', 'ASC')
            ->groupBy('c.id')
            ->getQuery()
            ->getResult()
            ;
    }

    // A FUSIONNER AVEC LA REQUETE AU DESSUS MAIS J'AI PAS TROUVE COMMENT FAIRE

//        return $this->createQueryBuilder('u')
//            ->select('c.competition_name', 'c.id')
//            ->join('u.votes', 'v')
//            ->join('v.picture', 'p')
//            ->join('p.competition', 'c')
//            ->where('u.id = :id')
//            ->setParameter('id', $user->getId())
//            ->orderBy('c.competition_name', 'ASC')
//            ->getQuery()
//            ->getResult()
//            ;

//    /**
//     * @return User[] Returns an array of User objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
