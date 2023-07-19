import { html, render } from '../../dom'
import { setState, State } from '../../store'

export function filters(state: State): ReturnType<typeof render> {
  return !state.filterDefinition
    ? render(html`<div class="filters-container"></div>`)
    : render(
        html`<div class="filters-container">
          <h2 class="filters-heading">Filters</h2>
          <div class="demographics">
            ${state.filterDefinition.demographics.map(
              demographic => html`<div class="demographics-section">
                    <h3 class="demographics-heading">${demographic.display}</h3>
                    <div class="options">
                      ${demographic.options.map(
                        (option, idx) =>
                          html`<div
                            class="option js-option"
                            tabindex=${0}
                            data-selected=${state.activeFilters[demographic.name] === option.name}
                            data-category=${demographic.name}
                            data-name=${option.name}
                          >
                            <div class="label">${option.display}</div>
                            <div class="count">
                              ${sumDemographics(state)[demographic.name][option.name]}%
                            </div>
                          </div>`,
                      )}
                    </div>
                  </div>
                `,
            )}
          </div>
        </div>`,
        el =>
          el.querySelectorAll('.js-option').forEach(elOption => {
            function EventHandler (evt: KeyboardEvent) {
              if (evt.type === 'keydown') {
                let target = evt.currentTarget as HTMLElement;
                if ((evt.key === 'ArrowDown' || evt.key === 'ArrowRight') && target?.nextSibling) {
                  (target.nextElementSibling as HTMLElement)?.focus();
                } 
                
                if ((evt.key === 'ArrowUp' || evt.key === 'ArrowLeft') && target?.previousSibling) {
                  (target.previousElementSibling as HTMLElement)?.focus();
                } 
              }

              if (evt.type === 'click' || evt.key === 'Enter') {
                const activeFilters = { ...state.activeFilters }
                let target = evt.currentTarget as HTMLElement;

                const { name, category, selected } = target.dataset
                if (!name || !category) return

                if (selected !== 'true') {
                  activeFilters[category] = name
                  target.setAttribute('data-selected', 'true')
                } else {
                  target.setAttribute('data-selected', 'false')
                  delete activeFilters[category]
                }
                setState({ activeFilters })
              }             
            }

            ['keydown', 'click'].forEach( e =>  elOption.addEventListener(e, (e) => EventHandler(e as KeyboardEvent)), false)
          }
        ),
      )
}

function sumDemographics({ survey }: State): Record<string, Record<string, number>> {
  if (!survey) return {}
  const counts = {} as any
  Object.values(survey.respondent_demographics).map(demographics => {
    Object.entries(demographics).map(([key, value]) => {
      if (counts[key] === undefined) {
        counts[key] = {}
      }

      if (!counts[key][value]) {
        counts[key][value] = 0
      }

      counts[key][value] += 1
    })
  })

  return counts
}
