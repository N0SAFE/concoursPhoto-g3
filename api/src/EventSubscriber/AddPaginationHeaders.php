<?php

namespace App\EventSubscriber;

use ApiPlatform\Doctrine\Orm\Paginator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class AddPaginationHeaders implements EventSubscriberInterface
{
    /**
     *  {@inheritdoc}
     */
    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::RESPONSE => 'addHeaders'];
    }
    public function addHeaders(ResponseEvent $event): void
    {
        $request = $event->getRequest();

        if (
            ($data = $request->attributes->get('data')) &&
            $data instanceof Paginator
        ) {
            $from = $data->count()
                ? ($data->getCurrentPage() - 1) * $data->getItemsPerPage()
                : 0;
            $to =
                $data->getCurrentPage() < $data->getLastPage()
                    ? $data->getCurrentPage() * $data->getItemsPerPage()
                    : $data->getTotalItems();

            $response = $event->getResponse();
            // add a new array to the response
            $content = $response->getContent();
            if ($content) {
                $content = \json_decode($content, true);
                $content['hydra:pagination'] = [
                    'Accept-Ranges' => 'items',
                    'Range-Unit' => 'items',
                    'Content-Range' => \sprintf(
                        '%u-%u/%u',
                        $from,
                        $to,
                        $data->getTotalItems()
                    ),
                    'Max-Page' => $data->getLastPage(),
                    'Current-Page' => $data->getCurrentPage(),
                    'Total-Items' => $data->getTotalItems(),
                ];
                $response->setContent(\json_encode($content));
            }
        }
    }
}
