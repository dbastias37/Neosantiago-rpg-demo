const {test,expect,capture,fits,stageStory}=require('./helpers.cjs');

test('expanded La Voz reading scrolls to real choices and retains the original choice result',async({page},info)=>{
 await stageStory(page);
 await expect(page.locator('#eventText')).toContainText('La voz volvió a oírse');
 await expect(page.locator('#eventText')).toContainText('una reserva aparte de las provisiones');
 await fits(page,'#eventText');await capture(page,info,'chapter-one-reading');
 const before=await page.evaluate(()=>({battery:stockCount('battery'),food:stockCount('food'),morale:state.morale}));
 await page.locator('[data-choice="2"]').scrollIntoViewIfNeeded();await fits(page,'[data-choice="2"]');await capture(page,info,'chapter-one-choices');
 await page.locator('[data-choice="2"]').click();await expect(page.locator('#result')).toBeVisible();
 const after=await page.evaluate(()=>({battery:stockCount('battery'),food:stockCount('food'),morale:state.morale}));
 expect(after).toEqual({...before,morale:before.morale+4});
 await page.locator('#advance').click();await expect(page.locator('#eventTitle')).toHaveText('Lo que no dicen los sabios');await expect(page.locator('#eventText')).toContainText('La carpeta tenía esquinas nuevas');
});
