const knapsack_capacity = 15;
items = {
    0 : {
        weight: 7,
        value: 9,
    },
    1 : {
        weight: 5,
        value: 9,
    },
    2 : {
        weight : 3,
        value: 8,
    },
    3: {
        weight: 1,
        value : 5,
    },
    4: {
        weight: 5,
        value: 4.
    },
    5: {
        weight: 0,
        value: 0,
    },
    6: {
        weight: 8,
        value: 2
    }
}


//A chromosome is an array of 0 and 1 values
//This function returns a set of chromosomes (which makes up a population)
function initialise_population(size_of_population, size_of_chromosomes) {
    let chromosomes_data = {};
    for (let i = 0; i< size_of_population;i++) {
        let current_chromosome = [];
        for(let j = 0; j< size_of_chromosomes;j++) {
           current_chromosome = current_chromosome.concat(Math.round(Math.random()));
        }
        chromosomes_data[i] = {};
        chromosomes_data[i].chromosomes = current_chromosome;
        chromosomes_data[i].fitness_value = 0;
    }
    return chromosomes_data;
}


//caulculate fitness value differs for each genetic algo
//In this case we are simply calculating the total value of items selected
function calculate_fitness_value(environment, chromosomes) {
    let fitness_value = 0;
    for(let i = 0; i< chromosomes.length; i++) {
        fitness_value += chromosomes[i] * environment[i].value;
    } 
    return fitness_value;
}

function calculate_fitness_for_chromosomes(environment, chromosomes_data) {
    for(let chromosomes in chromosomes_data) {
        chromosomes_data[chromosomes].fitness_value = calculate_fitness_value(environment, chromosomes_data[chromosomes].chromosomes);
    }
}

//need to remove all the chromoses that select all the items
function calculate_fitness_sum(chromosomes_data) {
    let fitness_sum = 0;
    for(let chromosome in chromosomes_data) {
        fitness_sum += chromosomes_data[chromosome].fitness_value;
    }
    return fitness_sum;
}

function get_parent_chromosome(random_choice, chromosome_data) {
    for(let chromosome in chromosome_data) {
        random_choice -= chromosome_data[chromosome].fitness_value;
        if(random_choice <= 0) {return chromosome_data[chromosome].chromosomes}
    }
}

function calculate_weight(environment, chromosome) {
  let total_weight = 0;
  for(let i = 0; i< Object.keys(environment).length; i++) {
    total_weight += environment[i].weight * chromosome[i];
  }
  return total_weight;
}

//the crossbreed algorithm that will be selected is onepoint crossover
//parent1_chromosome should have the same length as parent2_chromosome
function cross_breed(parent1_chromosome, parent2_chromosome) {
    point1 = 3;
    child_chromosome = [];
    for(let i = 0; i< point1;i++) {
        child_chromosome.push(parent1_chromosome[i]);
    }
    for(let i=point1; i< parent1_chromosome.length;i++) {
        child_chromosome.push(parent2_chromosome[i]);
    }
    if(calculate_weight(knapsack_capacity, child_chromosome) > knapsack_capacity) {
      return cross_breed(parent1_chromosome, parent2_chromosome);
    }
    return child_chromosome;
}

//take in a chromosome whcih is an array
function apply_mutation(chromosome, number_of_muations) {
    mutated_chromosome = chromosome.slice(0);
    for(let i = 0; i<number_of_muations; i++) {
        gene1_index = Math.round(Math.random() * (chromosome.length -1));
        gene2_index = Math.round(Math.random() * (chromosome.length -1));
        mutated_chromosome[gene1_index] = mutated_chromosome[gene2_index];
    }
    return mutated_chromosome;
}

function create_next_population(chromosomes_data, number_of_children) {
    generated_chromosomes = {};

    for(let i = 0; i< number_of_children; i+=2) {
        let fitness_sum = calculate_fitness_sum(chromosomes_data);
        let parent1_chromosome = get_parent_chromosome(Math.round(Math.random() * fitness_sum), chromosomes_data);
        let parent2_chromosome = get_parent_chromosome(Math.round(Math.random() * fitness_sum), chromosomes_data);
        let child1_chromosome = cross_breed(parent1_chromosome, parent2_chromosome);
        let child2_chromosome = cross_breed(parent2_chromosome, parent1_chromosome);
        generated_chromosomes[i] = {};
        generated_chromosomes[i].chromosomes = apply_mutation(child1_chromosome, 1);
        generated_chromosomes[i].fitness_value = 0;
        generated_chromosomes[i+1] = {};
        generated_chromosomes[i+1].chromosomes = apply_mutation(child2_chromosome, 1);
        generated_chromosomes[i+1].fitness_value = 0;
    }
    return generated_chromosomes; 
}


var population;
function start() {
    population = initialise_population(6, 7);
    console.log(population)

    for(let i = 0; i< 20; i++) {
        console.log("Generation: " + i);
        calculate_fitness_for_chromosomes(items, population);
        population = create_next_population(population, 6);
    }
    console.log(population)

};

start();