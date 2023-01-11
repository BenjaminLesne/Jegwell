<?php

namespace App\Controller;

use App\Entity\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductsController extends AbstractController
{
    #[Route('/creations', name: 'app_products')]
    public function index(): Response
    {
        $product = new Product();
        $product->setName('mon premier produit')
            ->setDescription("ma premier description génial")
            ->setPrice(3900)
            ->setSlug('premier-produit');

        return $this->render('products/index.html.twig');
    }
}
