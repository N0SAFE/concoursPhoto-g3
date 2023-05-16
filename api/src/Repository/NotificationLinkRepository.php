<?php

namespace App\Repository;

use App\Entity\NotificationLink;
use App\Entity\NotificationType;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<NotificationLink>
 *
 * @method NotificationLink|null find($id, $lockMode = null, $lockVersion = null)
 * @method NotificationLink|null findOneBy(array $criteria, array $orderBy = null)
 * @method NotificationLink[]    findAll()
 * @method NotificationLink[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NotificationLinkRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NotificationLink::class);
    }

    public function save(NotificationLink $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(NotificationLink $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return NotificationLink[] Returns an array of NotificationLink objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('n')
//            ->andWhere('n.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('n.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?NotificationLink
//    {
//        return $this->createQueryBuilder('n')
//            ->andWhere('n.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

    public function getAllUserByNotificationType(NotificationType $notificationType){
        return $this->createQueryBuilder('n')
            ->select('nl.label', 'nu.id', 'nu.firstname', 'nu.lastname', 'nu.email')
            ->join('n.notification', 'nl')
            ->join('n.user', 'nu')
            ->where('nl.label = :label')
            ->setParameter(':label', $notificationType->getLabel())
            ->getQuery()
            ->getResult()
            ;
    }


    public function getAllCompetitionsPosted(NotificationLink $notificationLink): array {
        return $this->createQueryBuilder('n')
            ->select('nl.label', 'nu.id', 'nu.firstname', 'nu.lastname', 'nu.email')
            ->join('n.notification', 'nl')
            ->join('n.user', 'nu')
            ->where('nl.label = :label')
            ->setParameter(':label', $notificationLink->getNotification()->getLabel())
            ->getQuery()
            ->getResult()
            ;
    }
}
