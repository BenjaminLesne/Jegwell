<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\ProductSearch;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductSearchType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'required' => false,
                'label' => 'catégories',
                'placeholder' => 'Toutes',
                'choice_label' => 'name',
            ])

    ->add('sort', ChoiceType::class, [
        'choices' => [
            'Nom A-Z' => 'name ASC',
            'Nom Z-A' => 'name DESC',
            'prix le + bas' => 'price ASC',
            'prix le + haut' => 'price DESC',
        ],
        'required' => false,
        'label' => 'Trier par:',
    ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ProductSearch::class,
            'method' => 'get',
            'csrf_protection' => false,
        ]);
    }

    public function getBlockPrefix()
    {
        return '';
    }
}
