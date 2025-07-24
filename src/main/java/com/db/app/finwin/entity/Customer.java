package com.db.app.finwin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name="CUSTOMER_DETAILS")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ID")
    Long id;
    @Column(name="CUSTOMER_NAME")
    String name;
    @Column(name="LANGUAGE")
    String language;
    @Column(name="CONTACT_NUMBER")
    String contact;
    @Column(name="EMAIL")
    String email;
    @Column(name="DATE_OF_BIRTH")
    Date dateOfBirth;
    @Column(name="ADDRESS")
    String address;

    @OneToMany(cascade=CascadeType.ALL,mappedBy = "customer")
    @Fetch(FetchMode.SUBSELECT)
    private Collection<CustomerExpense> customerExpense;

    @OneToMany(cascade=CascadeType.ALL,mappedBy = "customer")
    @Fetch(FetchMode.SUBSELECT)
    private Collection<CustomerGoal> customerGoals;


    @OneToMany(cascade=CascadeType.ALL,mappedBy = "customer")
    @Fetch(FetchMode.SUBSELECT)
    private Collection<CustomerIncome> customerIncomes;

    @OneToMany(cascade=CascadeType.ALL,mappedBy = "customer")
    @Fetch(FetchMode.SUBSELECT)
    private Collection<CustomerSaving>  customerSavings;
}
