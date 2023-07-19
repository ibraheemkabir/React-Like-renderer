import { html, render } from '../../dom'
import { State, SurveyResults } from '../../store'

function getAllRespondentIds({ survey }: State): string[] {
  return Object.keys((survey as SurveyResults)?.respondent_demographics ?? {})
}

function filterRespondents(
  answerRespondents: string[],
  filters: Record<string, string>,
  survey: { [respondentId: string]: Record<string, string>; }
) {
  const filterKeys = Object.keys(filters);

  return answerRespondents.filter((item: string)  => {
    return filterKeys.every(key => {
      return filters[key] === survey[item][key];
    });
  });
}

function getActiveRespondentIds(
  answerRespondents: string[],
  filters: Record<string, string>,
  survey?: SurveyResults
): string[] {
  console.log(answerRespondents, filters);
  if (Object.keys(filters).length === 0) return answerRespondents;
  const respondents = survey?.respondent_demographics ?? {};
  let filteredData: string[] = filterRespondents(answerRespondents, filters, respondents)
  return filteredData
}

function percentageOf(base: number, value: number): number {
  return base === 0 || value === 0 ? 0 : (100 / base) * value
}

export function survey(state: State): ReturnType<typeof render> {
  const allRespondentIds = getAllRespondentIds(state)
  return !state.survey
    ? render(html`<div class="survey-container"></div>`)
    : render(
        html`
          <div class="survey-container">
            <h2 class="survey-heading">${state.survey.title}</h2>
            <div class="question">
              <h3 class="question-heading">${state.survey.questions[0].title}</h3>

              <div class="answers">
                ${state.survey.questions[0].answers.map(({ respondent_ids, text }) => {
                  const activeRespondentsPercentage = percentageOf(
                    getActiveRespondentIds(allRespondentIds, state.activeFilters, state.survey).length,
                    getActiveRespondentIds(respondent_ids, state.activeFilters, state.survey).length,
                  )
                  return html` <div class="answer">
                    <div class="track" style="width: ${activeRespondentsPercentage}%"></div>
                    <div
                      class="marker"
                      style="width: ${percentageOf(
                        allRespondentIds.length,
                        respondent_ids.length,
                      )}%"
                    ></div>

                    <div class="label">${text}</div>

                    <div class="value">${Math.round(activeRespondentsPercentage)}%</div>
                  </div>`
                })}
              </div>
            </div>
          </div>
        `,
      )
}
