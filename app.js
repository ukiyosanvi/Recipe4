const RecipeApp = (() => {

    const recipes = [
        {
            id: 1,
            title: "Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Classic Italian pasta",
            ingredients: [
                "Spaghetti",
                "Eggs",
                "Cheese",
                "Pancetta",
                "Pepper"
            ],
            steps: [
                "Boil pasta",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Beat eggs",
                        "Add cheese",
                        {
                            text: "Season",
                            substeps: ["Add pepper", "Mix well"]
                        }
                    ]
                },
                "Combine pasta and sauce"
            ]
        },
        {
            id: 2,
            title: "Veg Fried Rice",
            time: 20,
            difficulty: "easy",
            description: "Quick and tasty rice",
            ingredients: [
                "Rice",
                "Vegetables",
                "Soy sauce",
                "Oil"
            ],
            steps: [
                "Cook rice",
                "Stir fry vegetables",
                "Add rice and sauce",
                "Mix well"
            ]
        }
    ];

    let currentFilter = "all";
    let currentSort = "none";

    const recipeContainer = document.querySelector("#recipe-container");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortButtons = document.querySelectorAll(".sort-btn");

    const renderSteps = (steps, level = 0) => {
        const cls = level === 0 ? "steps-list" : "substeps-list";
        let html = `<ol class="${cls}">`;

        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<li>${step}</li>`;
            } else {
                html += `<li>${step.text}`;
                if (step.substeps) {
                    html += renderSteps(step.substeps, level + 1);
                }
                html += `</li>`;
            }
        });

        html += `</ol>`;
        return html;
    };

    const createStepsHTML = (steps) => renderSteps(steps);

    const createRecipeCard = (recipe) => `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>

            <div class="card-actions">
                <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">📋 Show Steps</button>
                <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">🥗 Show Ingredients</button>
            </div>

            <div class="ingredients-container" data-id="${recipe.id}">
                <ul>
                    ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
                </ul>
            </div>

            <div class="steps-container" data-id="${recipe.id}">
                ${createStepsHTML(recipe.steps)}
            </div>
        </div>
    `;

    const updateDisplay = () => {
        let data = [...recipes];

        if (currentFilter !== "all") {
            data = data.filter(r => r.difficulty === currentFilter);
        }

        if (currentSort === "name") {
            data.sort((a, b) => a.title.localeCompare(b.title));
        }

        if (currentSort === "time") {
            data.sort((a, b) => a.time - b.time);
        }

        recipeContainer.innerHTML = data.map(createRecipeCard).join("");
    };

    const handleToggleClick = (e) => {
        if (!e.target.classList.contains("toggle-btn")) return;

        const id = e.target.dataset.id;
        const type = e.target.dataset.type;

        const container = document.querySelector(
            `.${type}-container[data-id="${id}"]`
        );

        container.classList.toggle("visible");

        e.target.textContent = container.classList.contains("visible")
            ? (type === "steps" ? "📋 Hide Steps" : "🥗 Hide Ingredients")
            : (type === "steps" ? "📋 Show Steps" : "🥗 Show Ingredients");
    };

    const setupEventListeners = () => {
        filterButtons.forEach(btn =>
            btn.addEventListener("click", () => {
                currentFilter = btn.dataset.filter;
                updateDisplay();
            })
        );

        sortButtons.forEach(btn =>
            btn.addEventListener("click", () => {
                currentSort = btn.dataset.sort;
                updateDisplay();
            })
        );

        recipeContainer.addEventListener("click", handleToggleClick);
    };

    const init = () => {
        setupEventListeners();
        updateDisplay();
    };

    return { init };

})();

RecipeApp.init();
