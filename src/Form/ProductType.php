<?php

namespace App\Form;

use App\Entity\Product;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    private $repository;
    private $em;

    public function __construct(CategoryRepository $repository, EntityManagerInterface $em)
    {
        $this->repository = $repository;
        $this->em = $em;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $categories = $this->repository->findAll();
        $builder
            ->add('name', null, [
                'label' => 'nom',
            ])
            ->add('description', null, [
                'label' => 'description',
            ])
            ->add('categories', ChoiceType::class, [
                'label' => 'catégories',
   'choices' => $categories,
'choice_value' => 'id',
'choice_label' => 'name',
'multiple' => true,
            ])
            ->add('options', null, [
                'label' => 'options',
            ])
            ->add('relatedProducts', null, [
                'label' => 'produits associés',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
